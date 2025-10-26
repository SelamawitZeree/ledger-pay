#!/bin/bash

# LedgerPay AWS Deployment Script
# Efficient deployment using Fargate, RDS, and Amplify

set -e

echo "🚀 LedgerPay AWS Deployment Script"
echo "==================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    echo "Please install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Not logged in to AWS"
    echo "Please run: aws configure"
    exit 1
fi

# Set variables
export AWS_REGION="${AWS_REGION:-us-east-1}"
export PROJECT_NAME="${PROJECT_NAME:-ledgerpay}"
export ENVIRONMENT="${ENVIRONMENT:-prod}"
export ECR_REGISTRY="${ECR_REGISTRY:-$(aws sts get-caller-identity --query Account --output text).dkr.ecr.${AWS_REGION}.amazonaws.com}"
export RDS_PASSWORD="${RDS_PASSWORD:-LedgerPay2025!}"

echo "📋 Configuration:"
echo "  AWS Region: $AWS_REGION"
echo "  Project Name: $PROJECT_NAME"
echo "  Environment: $ENVIRONMENT"
echo "  ECR Registry: $ECR_REGISTRY"
echo ""

read -p "Continue with AWS deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Step 1: Create ECR Repositories
echo ""
echo "📦 Step 1/8: Creating ECR Repositories..."
services=("auth-service" "accounts-service" "posting-service" "query-service" "audit-service")

for service in "${services[@]}"; do
    echo "Creating ECR repository for $service..."
    aws ecr create-repository \
        --repository-name $PROJECT_NAME/$service \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true \
        --output table 2>/dev/null || echo "Repository $PROJECT_NAME/$service already exists"
done
echo "✅ ECR repositories created"

# Step 2: Build and Push Docker Images
echo ""
echo "🔨 Step 2/8: Building and Pushing Docker Images..."

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

for service in "${services[@]}"; do
    echo "Building and pushing $service..."
    docker build -t $ECR_REGISTRY/$PROJECT_NAME/$service:latest ./services/$service
    docker push $ECR_REGISTRY/$PROJECT_NAME/$service:latest
    echo "✅ $service pushed to ECR"
done

# Step 3: Create VPC and Networking
echo ""
echo "🌐 Step 3/8: Creating VPC and Networking..."

# Create VPC
VPC_ID=$(aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --region $AWS_REGION \
    --query Vpc.VpcId \
    --output text)

# Enable DNS hostnames
aws ec2 modify-vpc-attribute \
    --vpc-id $VPC_ID \
    --enable-dns-hostnames \
    --region $AWS_REGION

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
    --region $AWS_REGION \
    --query InternetGateway.InternetGatewayId \
    --output text)

aws ec2 attach-internet-gateway \
    --vpc-id $VPC_ID \
    --internet-gateway-id $IGW_ID \
    --region $AWS_REGION

# Create Public Subnet
PUBLIC_SUBNET_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.1.0/24 \
    --availability-zone ${AWS_REGION}a \
    --region $AWS_REGION \
    --query Subnet.SubnetId \
    --output text)

# Create Private Subnet
PRIVATE_SUBNET_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.2.0/24 \
    --availability-zone ${AWS_REGION}b \
    --region $AWS_REGION \
    --query Subnet.SubnetId \
    --output text)

# Create Route Table for Public Subnet
PUBLIC_RT_ID=$(aws ec2 create-route-table \
    --vpc-id $VPC_ID \
    --region $AWS_REGION \
    --query RouteTable.RouteTableId \
    --output text)

aws ec2 create-route \
    --route-table-id $PUBLIC_RT_ID \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id $IGW_ID \
    --region $AWS_REGION

aws ec2 associate-route-table \
    --subnet-id $PUBLIC_SUBNET_ID \
    --route-table-id $PUBLIC_RT_ID \
    --region $AWS_REGION

echo "✅ VPC and networking created"

# Step 4: Create Security Groups
echo ""
echo "🔒 Step 4/8: Creating Security Groups..."

# ALB Security Group
ALB_SG_ID=$(aws ec2 create-security-group \
    --group-name $PROJECT_NAME-alb-sg \
    --description "Security group for ALB" \
    --vpc-id $VPC_ID \
    --region $AWS_REGION \
    --query GroupId \
    --output text)

aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION

# ECS Security Group
ECS_SG_ID=$(aws ec2 create-security-group \
    --group-name $PROJECT_NAME-ecs-sg \
    --description "Security group for ECS tasks" \
    --vpc-id $VPC_ID \
    --region $AWS_REGION \
    --query GroupId \
    --output text)

aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 8080 \
    --source-group $ALB_SG_ID \
    --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 8081 \
    --source-group $ALB_SG_ID \
    --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 8082 \
    --source-group $ALB_SG_ID \
    --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 8083 \
    --source-group $ALB_SG_ID \
    --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 8084 \
    --source-group $ALB_SG_ID \
    --region $AWS_REGION

# RDS Security Group
RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name $PROJECT_NAME-rds-sg \
    --description "Security group for RDS" \
    --vpc-id $VPC_ID \
    --region $AWS_REGION \
    --query GroupId \
    --output text)

aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $ECS_SG_ID \
    --region $AWS_REGION

echo "✅ Security groups created"

# Step 5: Create RDS PostgreSQL Instance
echo ""
echo "🗄️ Step 5/8: Creating RDS PostgreSQL Instance..."

# Create DB Subnet Group
aws rds create-db-subnet-group \
    --db-subnet-group-name $PROJECT_NAME-db-subnet-group \
    --db-subnet-group-description "Subnet group for LedgerPay RDS" \
    --subnet-ids $PRIVATE_SUBNET_ID $PUBLIC_SUBNET_ID \
    --region $AWS_REGION

# Create RDS Instance
aws rds create-db-instance \
    --db-instance-identifier $PROJECT_NAME-postgres \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 16.1 \
    --master-username ledgeradmin \
    --master-user-password $RDS_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids $RDS_SG_ID \
    --db-subnet-group-name $PROJECT_NAME-db-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --region $AWS_REGION \
    --output table

echo "✅ RDS PostgreSQL instance created (this may take 10-15 minutes)"

# Step 6: Create ECS Cluster
echo ""
echo "🏗️ Step 6/8: Creating ECS Cluster..."

aws ecs create-cluster \
    --cluster-name $PROJECT_NAME-cluster \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
    --region $AWS_REGION \
    --output table

echo "✅ ECS cluster created"

# Step 7: Create Task Definitions and Services
echo ""
echo "🚀 Step 7/8: Creating Task Definitions and Services..."

# Wait for RDS to be available
echo "Waiting for RDS to be available..."
aws rds wait db-instance-available \
    --db-instance-identifier $PROJECT_NAME-postgres \
    --region $AWS_REGION

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $PROJECT_NAME-postgres \
    --region $AWS_REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo "RDS Endpoint: $RDS_ENDPOINT"

# Create Application Load Balancer
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name $PROJECT_NAME-alb \
    --subnets $PUBLIC_SUBNET_ID \
    --security-groups $ALB_SG_ID \
    --region $AWS_REGION \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --region $AWS_REGION \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

echo "ALB DNS: $ALB_DNS"

# Create target groups and services for each microservice
ports=(8080 8081 8082 8083 8084)
service_names=("auth" "accounts" "posting" "query" "audit")

for i in "${!services[@]}"; do
    service="${services[$i]}"
    port="${ports[$i]}"
    service_name="${service_names[$i]}"
    
    echo "Creating task definition for $service..."
    
    # Create task definition JSON
    cat > $service-task-definition.json << EOF
{
  "family": "$PROJECT_NAME-$service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "$service",
      "image": "$ECR_REGISTRY/$PROJECT_NAME/$service:latest",
      "portMappings": [
        {
          "containerPort": $port,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        },
        {
          "name": "SERVER_PORT",
          "value": "$port"
        },
        {
          "name": "SPRING_DATASOURCE_URL",
          "value": "jdbc:postgresql://$RDS_ENDPOINT:5432/${service_name}db?sslmode=require"
        },
        {
          "name": "SPRING_DATASOURCE_USERNAME",
          "value": "ledgeradmin"
        },
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "value": "$RDS_PASSWORD"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$PROJECT_NAME-$service",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

    # Register task definition
    aws ecs register-task-definition \
        --cli-input-json file://$service-task-definition.json \
        --region $AWS_REGION

    # Create CloudWatch log group
    aws logs create-log-group \
        --log-group-name /ecs/$PROJECT_NAME-$service \
        --region $AWS_REGION 2>/dev/null || true

    # Create target group
    TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
        --name $PROJECT_NAME-$service-tg \
        --protocol HTTP \
        --port $port \
        --vpc-id $VPC_ID \
        --target-type ip \
        --health-check-path /actuator/health \
        --region $AWS_REGION \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    # Create ECS service
    aws ecs create-service \
        --cluster $PROJECT_NAME-cluster \
        --service-name $PROJECT_NAME-$service \
        --task-definition $PROJECT_NAME-$service \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_ID],securityGroups=[$ECS_SG_ID],assignPublicIp=DISABLED}" \
        --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=$service,containerPort=$port" \
        --region $AWS_REGION

    echo "✅ $service service created"
done

# Step 8: Create ALB Listener Rules
echo ""
echo "🎯 Step 8/8: Creating ALB Listener Rules..."

# Create default listener
LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$(aws elbv2 describe-target-groups --names $PROJECT_NAME-auth-tg --region $AWS_REGION --query 'TargetGroups[0].TargetGroupArn' --output text) \
    --region $AWS_REGION \
    --query 'Listeners[0].ListenerArn' \
    --output text)

# Create listener rules for each service
paths=("/api/v1/auth/*" "/api/v1/accounts/*" "/api/v1/transactions/*" "/api/v1/balances/*" "/api/v1/audit/*")

for i in "${!services[@]}"; do
    service="${services[$i]}"
    path="${paths[$i]}"
    
    TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups \
        --names $PROJECT_NAME-$service-tg \
        --region $AWS_REGION \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    aws elbv2 create-rule \
        --listener-arn $LISTENER_ARN \
        --priority $((i + 1)) \
        --conditions Field=path-pattern,Values=$path \
        --actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN \
        --region $AWS_REGION
done

echo "✅ ALB listener rules created"

# Save deployment info
cat > aws-deployment-info.txt << EOF
===========================================
LedgerPay AWS Deployment Information
===========================================

Region: $AWS_REGION
Project: $PROJECT_NAME
Environment: $ENVIRONMENT

ECR Registry: $ECR_REGISTRY

VPC: $VPC_ID
Public Subnet: $PUBLIC_SUBNET_ID
Private Subnet: $PRIVATE_SUBNET_ID

ALB DNS: $ALB_DNS
ALB ARN: $ALB_ARN

RDS Endpoint: $RDS_ENDPOINT
RDS Password: $RDS_PASSWORD

ECS Cluster: $PROJECT_NAME-cluster

Service URLs:
  Auth Service:     http://$ALB_DNS/api/v1/auth
  Accounts Service: http://$ALB_DNS/api/v1/accounts
  Posting Service:  http://$ALB_DNS/api/v1/transactions
  Query Service:    http://$ALB_DNS/api/v1/balances
  Audit Service:    http://$ALB_DNS/api/v1/audit

Test Commands:
  # Register User
  curl -X POST http://$ALB_DNS/api/v1/auth/users/register \\
    -H "Content-Type: application/json" \\
    -d '{"username":"awsuser","email":"aws@example.com","firstName":"AWS","lastName":"User","password":"password123","companyName":"AWS Company","phoneNumber":"+1234567890","role":"USER"}'

  # Health Check
  curl http://$ALB_DNS/api/v1/auth/actuator/health

Management Commands:
  # View ECS services
  aws ecs list-services --cluster $PROJECT_NAME-cluster --region $AWS_REGION

  # View service logs
  aws logs describe-log-streams --log-group-name /ecs/$PROJECT_NAME-auth-service --region $AWS_REGION

  # Scale service
  aws ecs update-service --cluster $PROJECT_NAME-cluster --service $PROJECT_NAME-auth-service --desired-count 2 --region $AWS_REGION

Cleanup Commands:
  # Delete all resources (careful!)
  aws ecs delete-service --cluster $PROJECT_NAME-cluster --service $PROJECT_NAME-auth-service --region $AWS_REGION
  aws ecs delete-cluster --cluster $PROJECT_NAME-cluster --region $AWS_REGION
  aws rds delete-db-instance --db-instance-identifier $PROJECT_NAME-postgres --skip-final-snapshot --region $AWS_REGION

Deployed on: $(date)
===========================================
EOF

echo "✅ Configuration saved to aws-deployment-info.txt"

# Final Summary
echo ""
echo "🎉 AWS Deployment Complete!"
echo "==========================="
echo ""
echo "📍 Your LedgerPay application is now running on AWS!"
echo ""
echo "🌐 Service URLs:"
echo "  Auth Service:     http://$ALB_DNS/api/v1/auth"
echo "  Accounts Service: http://$ALB_DNS/api/v1/accounts"
echo "  Posting Service:  http://$ALB_DNS/api/v1/transactions"
echo "  Query Service:    http://$ALB_DNS/api/v1/balances"
echo "  Audit Service:    http://$ALB_DNS/api/v1/audit"
echo ""
echo "📋 Configuration saved to: aws-deployment-info.txt"
echo ""
echo "🧪 Test your deployment:"
echo "  curl http://$ALB_DNS/api/v1/auth/actuator/health"
echo ""
echo "📚 View logs:"
echo "  aws logs describe-log-streams --log-group-name /ecs/$PROJECT_NAME-auth-service --region $AWS_REGION"
echo ""
echo "💰 Estimated Monthly Cost:"
echo "  - Fargate (5 services): ~$30-50"
echo "  - RDS PostgreSQL: ~$15-25"
echo "  - ALB: ~$20-30"
echo "  - Total: ~$65-105/month"
echo ""
echo "🗑️ To delete all resources:"
echo "  See cleanup commands in aws-deployment-info.txt"
echo ""

# Clean up temporary files
rm -f *-task-definition.json

echo "🎯 Next Steps:"
echo "1. Deploy your Next.js frontend to AWS Amplify"
echo "2. Configure custom domain with Route 53"
echo "3. Set up CI/CD pipelines"
echo "4. Monitor with CloudWatch dashboards"
echo ""
