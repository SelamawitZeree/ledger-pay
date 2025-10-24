#!/bin/bash

# LedgerPay Azure Deployment Script
# This script automates the deployment of LedgerPay to Azure

set -e  # Exit on error

echo "🚀 LedgerPay Azure Deployment Script"
echo "====================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed"
    echo "Please install it from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure"
    echo "Please run: az login"
    exit 1
fi

# Set variables
export RESOURCE_GROUP="${RESOURCE_GROUP:-ledgerpay-rg}"
export LOCATION="${LOCATION:-eastus}"
export ACR_NAME="${ACR_NAME:-ledgerpayacr$(date +%s)}"  # Add timestamp for uniqueness
export VNET_NAME="${VNET_NAME:-ledgerpay-vnet}"
export SUBNET_NAME="${SUBNET_NAME:-ledgerpay-subnet}"
export POSTGRES_SERVER="${POSTGRES_SERVER:-ledgerpaydb$(date +%s)}"  # Add timestamp
export POSTGRES_ADMIN="${POSTGRES_ADMIN:-ledgeradmin}"
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-LedgerPay2025!}"
export CONTAINER_ENV="${CONTAINER_ENV:-ledgerpay-env}"

echo "📋 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  ACR Name: $ACR_NAME"
echo "  PostgreSQL Server: $POSTGRES_SERVER"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Step 1: Create Resource Group
echo ""
echo "📦 Step 1/10: Creating Resource Group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table
echo "✅ Resource group created"

# Step 2: Create Azure Container Registry
echo ""
echo "📦 Step 2/10: Creating Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true \
  --output table

ACR_LOGIN_SERVER=$(az acr show \
  --name $ACR_NAME \
  --query loginServer \
  --output tsv)

echo "✅ ACR created: $ACR_LOGIN_SERVER"

# Step 3: Login to ACR and Build Images
echo ""
echo "🔨 Step 3/10: Building and Pushing Docker Images..."
az acr login --name $ACR_NAME

# Build and push services
services=("auth-service" "accounts-service" "posting-service" "query-service" "audit-service")

for service in "${services[@]}"; do
    echo "Building $service..."
    docker build -t $ACR_LOGIN_SERVER/$service:latest ./services/$service
    docker push $ACR_LOGIN_SERVER/$service:latest
    echo "✅ $service pushed"
done

# Step 4: Create Virtual Network
echo ""
echo "🌐 Step 4/10: Creating Virtual Network..."
az network vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --address-prefix 10.0.0.0/16 \
  --subnet-name $SUBNET_NAME \
  --subnet-prefix 10.0.0.0/23 \
  --output table
echo "✅ Virtual Network created"

# Step 5: Create PostgreSQL Server
echo ""
echo "🗄️ Step 5/10: Creating PostgreSQL Server (this may take a few minutes)..."
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --location $LOCATION \
  --admin-user $POSTGRES_ADMIN \
  --admin-password $POSTGRES_PASSWORD \
  --sku-name Standard_B2s \
  --tier Burstable \
  --version 16 \
  --storage-size 32 \
  --public-access 0.0.0.0-255.255.255.255 \
  --yes \
  --output table

POSTGRES_HOST="${POSTGRES_SERVER}.postgres.database.azure.com"
echo "✅ PostgreSQL server created: $POSTGRES_HOST"

# Step 6: Create Databases
echo ""
echo "📊 Step 6/10: Creating Databases..."
databases=("authdb" "accountsdb" "postingdb" "querydb" "auditdb")

for db in "${databases[@]}"; do
    echo "Creating database: $db"
    az postgres flexible-server db create \
      --resource-group $RESOURCE_GROUP \
      --server-name $POSTGRES_SERVER \
      --database-name $db \
      --output table
done
echo "✅ All databases created"

# Step 7: Create Container Apps Environment
echo ""
echo "🏗️ Step 7/10: Creating Container Apps Environment..."
SUBNET_ID=$(az network vnet subnet show \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name $SUBNET_NAME \
  --query id \
  --output tsv)

az containerapp env create \
  --name $CONTAINER_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --infrastructure-subnet-resource-id $SUBNET_ID \
  --output table
echo "✅ Container Apps Environment created"

# Step 8: Get ACR Credentials
echo ""
echo "🔑 Step 8/10: Getting ACR Credentials..."
ACR_USERNAME=$(az acr credential show \
  --name $ACR_NAME \
  --query username \
  --output tsv)

ACR_PASSWORD=$(az acr credential show \
  --name $ACR_NAME \
  --query passwords[0].value \
  --output tsv)

# Step 9: Deploy Services
echo ""
echo "🚀 Step 9/10: Deploying Services..."

# Deploy Auth Service
echo "Deploying auth-service..."
az containerapp create \
  --name auth-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_ENV \
  --image $ACR_LOGIN_SERVER/auth-service:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 8080 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=prod" \
    "SERVER_PORT=8080" \
  --output table

AUTH_URL=$(az containerapp show \
  --name auth-service \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ Auth Service deployed: https://$AUTH_URL"

# Deploy Accounts Service
echo "Deploying accounts-service..."
az containerapp create \
  --name accounts-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_ENV \
  --image $ACR_LOGIN_SERVER/accounts-service:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 8081 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=prod" \
    "SERVER_PORT=8081" \
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${POSTGRES_HOST}:5432/accountsdb?sslmode=require" \
    "SPRING_DATASOURCE_USERNAME=${POSTGRES_ADMIN}" \
    "SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}" \
  --output table

ACCOUNTS_URL=$(az containerapp show \
  --name accounts-service \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ Accounts Service deployed: https://$ACCOUNTS_URL"

# Deploy Posting Service
echo "Deploying posting-service..."
az containerapp create \
  --name posting-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_ENV \
  --image $ACR_LOGIN_SERVER/posting-service:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 8082 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=prod" \
    "SERVER_PORT=8082" \
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${POSTGRES_HOST}:5432/postingdb?sslmode=require" \
    "SPRING_DATASOURCE_USERNAME=${POSTGRES_ADMIN}" \
    "SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}" \
  --output table

POSTING_URL=$(az containerapp show \
  --name posting-service \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ Posting Service deployed: https://$POSTING_URL"

# Deploy Query Service
echo "Deploying query-service..."
az containerapp create \
  --name query-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_ENV \
  --image $ACR_LOGIN_SERVER/query-service:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 8083 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=prod" \
    "SERVER_PORT=8083" \
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${POSTGRES_HOST}:5432/querydb?sslmode=require" \
    "SPRING_DATASOURCE_USERNAME=${POSTGRES_ADMIN}" \
    "SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}" \
  --output table

QUERY_URL=$(az containerapp show \
  --name query-service \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ Query Service deployed: https://$QUERY_URL"

# Deploy Audit Service
echo "Deploying audit-service..."
az containerapp create \
  --name audit-service \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_ENV \
  --image $ACR_LOGIN_SERVER/audit-service:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 8084 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    "SPRING_PROFILES_ACTIVE=prod" \
    "SERVER_PORT=8084" \
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${POSTGRES_HOST}:5432/auditdb?sslmode=require" \
    "SPRING_DATASOURCE_USERNAME=${POSTGRES_ADMIN}" \
    "SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}" \
  --output table

AUDIT_URL=$(az containerapp show \
  --name audit-service \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ Audit Service deployed: https://$AUDIT_URL"

# Step 10: Save Configuration
echo ""
echo "💾 Step 10/10: Saving Configuration..."

cat > azure-deployment-info.txt << EOF
===========================================
LedgerPay Azure Deployment Information
===========================================

Resource Group: $RESOURCE_GROUP
Location: $LOCATION

Container Registry:
  Name: $ACR_NAME
  Login Server: $ACR_LOGIN_SERVER

PostgreSQL:
  Server: $POSTGRES_HOST
  Admin User: $POSTGRES_ADMIN
  Databases: authdb, accountsdb, postingdb, querydb, auditdb

Service URLs:
  Auth Service:     https://$AUTH_URL
  Accounts Service: https://$ACCOUNTS_URL
  Posting Service:  https://$POSTING_URL
  Query Service:    https://$QUERY_URL
  Audit Service:    https://$AUDIT_URL

Test Commands:
  # Register User
  curl -X POST https://$AUTH_URL/api/v1/users/register \\
    -H "Content-Type: application/json" \\
    -d '{"username":"azureuser","email":"azure@example.com","firstName":"Azure","lastName":"User","password":"password123","companyName":"Azure Company","phoneNumber":"+1234567890","role":"USER"}'

  # Health Check
  curl https://$AUTH_URL/actuator/health

Cleanup Command:
  az group delete --name $RESOURCE_GROUP --yes --no-wait

Deployed on: $(date)
===========================================
EOF

echo "✅ Configuration saved to azure-deployment-info.txt"

# Final Summary
echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "📍 All services are now running on Azure!"
echo ""
echo "🌐 Service URLs:"
echo "  Auth Service:     https://$AUTH_URL"
echo "  Accounts Service: https://$ACCOUNTS_URL"
echo "  Posting Service:  https://$POSTING_URL"
echo "  Query Service:    https://$QUERY_URL"
echo "  Audit Service:    https://$AUDIT_URL"
echo ""
echo "📋 Configuration saved to: azure-deployment-info.txt"
echo ""
echo "🧪 Test your deployment:"
echo "  curl https://$AUTH_URL/actuator/health"
echo ""
echo "📚 View logs:"
echo "  az containerapp logs show --name auth-service --resource-group $RESOURCE_GROUP --follow"
echo ""
echo "🗑️ To delete all resources:"
echo "  az group delete --name $RESOURCE_GROUP --yes --no-wait"
echo ""

