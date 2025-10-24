# Azure Deployment - Quick Start Guide

Deploy your LedgerPay application to Azure in minutes!

## 🚀 Quick Deployment (Automated)

### Step 1: Install Azure CLI

```bash
# macOS
brew update && brew install azure-cli

# Or download from: https://aka.ms/installazureclimacos
```

### Step 2: Login to Azure

```bash
az login
```

This will open a browser window for authentication.

### Step 3: Run the Deployment Script

```bash
# Make sure you're in the project directory
cd /Users/selamawitzere/Downloads/Ledger-pay

# Run the automated deployment script
./deploy-to-azure.sh
```

That's it! The script will:
- ✅ Create all Azure resources
- ✅ Build and push Docker images
- ✅ Deploy all 5 microservices
- ✅ Configure databases
- ✅ Provide you with service URLs

**Estimated time**: 15-20 minutes

## 📋 What Gets Deployed

### Services:
1. **Auth Service** - User authentication and registration
2. **Accounts Service** - Account management
3. **Posting Service** - Transaction processing
4. **Query Service** - Balance queries
5. **Audit Service** - Audit logging

### Infrastructure:
- **Azure Container Apps** - Hosts your microservices
- **Azure Database for PostgreSQL** - 5 databases (one per service)
- **Azure Container Registry** - Stores Docker images
- **Virtual Network** - Secure networking
- **Auto-scaling** - Scales from 1-3 instances based on load

## 🌐 Accessing Your Services

After deployment, you'll receive URLs for each service:

```
Auth Service:     https://auth-service--<unique-id>.azurecontainerapps.io
Accounts Service: https://accounts-service--<unique-id>.azurecontainerapps.io
Posting Service:  https://posting-service--<unique-id>.azurecontainerapps.io
Query Service:    https://query-service--<unique-id>.azurecontainerapps.io
Audit Service:    https://audit-service--<unique-id>.azurecontainerapps.io
```

## 🧪 Testing Your Deployment

### Test 1: Health Check

```bash
# Replace <auth-service-url> with your actual URL
curl https://<auth-service-url>/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

### Test 2: Register a User

```bash
curl -X POST https://<auth-service-url>/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "azureuser",
    "email": "azure@example.com",
    "firstName": "Azure",
    "lastName": "User",
    "password": "password123",
    "companyName": "Azure Company",
    "phoneNumber": "+1234567890",
    "role": "USER"
  }'
```

Expected response:
```json
{
  "id": 1,
  "username": "azureuser",
  "email": "azure@example.com",
  "tenantId": "TENANT-AZURE-COMPANY-123456",
  "role": "USER",
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "User registered successfully"
}
```

### Test 3: Login

```bash
curl -X POST https://<auth-service-url>/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=azureuser&tenantId=TENANT-AZURE-COMPANY-123456&role=USER"
```

## 📊 Monitoring

### View Logs

```bash
# View auth service logs
az containerapp logs show \
  --name auth-service \
  --resource-group ledgerpay-rg \
  --follow

# View accounts service logs
az containerapp logs show \
  --name accounts-service \
  --resource-group ledgerpay-rg \
  --follow
```

### Check Service Status

```bash
# List all services
az containerapp list \
  --resource-group ledgerpay-rg \
  --output table
```

### Azure Portal

Visit: https://portal.azure.com
- Navigate to Resource Groups → `ledgerpay-rg`
- View all deployed resources
- Access monitoring dashboards
- View metrics and logs

## 🔄 Updating Your Services

### Update a Single Service

```bash
# 1. Rebuild the Docker image
docker build -t <acr-name>.azurecr.io/auth-service:latest ./services/auth-service

# 2. Push to Azure Container Registry
docker push <acr-name>.azurecr.io/auth-service:latest

# 3. Update the container app
az containerapp update \
  --name auth-service \
  --resource-group ledgerpay-rg \
  --image <acr-name>.azurecr.io/auth-service:latest
```

### Update All Services

```bash
# Re-run the deployment script
./deploy-to-azure.sh
```

## 💰 Cost Estimate

### Monthly Cost (Development):
- Container Apps: ~$50-100 (5 services, minimal usage)
- PostgreSQL: ~$30-50 (Burstable tier)
- Container Registry: ~$5 (Basic tier)
- **Total**: ~$85-155/month

### Tips to Reduce Costs:
1. Scale to 0 when not in use
2. Use dev/test pricing for non-production
3. Delete resources when not needed:
   ```bash
   az group delete --name ledgerpay-rg --yes --no-wait
   ```

## 🔒 Security

### Default Security Features:
- ✅ HTTPS enabled by default
- ✅ Private networking for database
- ✅ JWT authentication for API
- ✅ Azure AD integration ready
- ✅ Network isolation with VNet

### Recommended Additional Security:
1. **Azure Key Vault** - Store secrets securely
2. **Azure AD** - Enterprise authentication
3. **Private Endpoints** - No public database access
4. **Azure DDoS Protection** - DDoS mitigation

## 🗑️ Cleanup

### Delete All Resources

```bash
# Delete everything (careful!)
az group delete --name ledgerpay-rg --yes --no-wait

# Verify deletion
az group list --output table
```

This will delete:
- All 5 microservices
- PostgreSQL databases
- Container Registry
- Virtual Network
- All other resources

**Note**: This action cannot be undone!

## 🆘 Troubleshooting

### Issue: "az: command not found"
**Solution**: Install Azure CLI
```bash
brew install azure-cli
```

### Issue: "Not logged in to Azure"
**Solution**: Login to Azure
```bash
az login
```

### Issue: "Resource name already exists"
**Solution**: The script will add a timestamp to make names unique. If it still fails, edit the script and change the base names.

### Issue: "Service not starting"
**Solution**: Check logs
```bash
az containerapp logs show \
  --name <service-name> \
  --resource-group ledgerpay-rg \
  --tail 100
```

### Issue: "Cannot connect to database"
**Solution**: Check PostgreSQL firewall rules
```bash
az postgres flexible-server firewall-rule create \
  --resource-group ledgerpay-rg \
  --name <postgres-server> \
  --rule-name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

## 📞 Support

### Azure Resources:
- [Azure Container Apps Docs](https://docs.microsoft.com/azure/container-apps/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [Azure Support](https://azure.microsoft.com/support/)

### LedgerPay Resources:
- GitHub: https://github.com/SelamawitZeree/ledger-pay
- Deployment Guide: See `AZURE_DEPLOYMENT_GUIDE.md`

## 🎯 Next Steps

After deployment:

1. **Update Frontend** - Point your Next.js frontend to Azure URLs
2. **Setup Custom Domain** - Add your own domain name
3. **Configure CI/CD** - Automate deployments with GitHub Actions
4. **Enable Monitoring** - Add Application Insights
5. **Setup Backups** - Configure database backups
6. **Scale Services** - Adjust min/max replicas based on load

## ✅ Checklist

- [ ] Azure CLI installed
- [ ] Logged in to Azure
- [ ] Deployment script executed
- [ ] All services deployed successfully
- [ ] Service URLs obtained
- [ ] Health checks passed
- [ ] User registration tested
- [ ] Monitoring configured
- [ ] Costs reviewed
- [ ] Cleanup plan in place

---

🎉 **Congratulations!** Your LedgerPay application is now running on Azure!

For detailed documentation, see `AZURE_DEPLOYMENT_GUIDE.md`

