# Deployment Guide

This document provides instructions for deploying the ANTSA Landing Page to Azure Static Web Apps.

## Prerequisites

- Azure account with an active subscription
- Azure CLI installed and authenticated (`az login`)
- GitHub repository (already created)

## Deploy to Azure Static Web Apps

### Option 1: Using Azure Portal

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" and search for "Static Web App"
3. Fill in the required details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `antsa-landing-page`
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: `antsa-landing-page`
   - **Branch**: `main`
   - **Build Details**:
     - Build Presets: `Custom`
     - App location: `/`
     - Output location: `dist`
4. Click "Review + Create" then "Create"
5. Azure will create a GitHub Actions workflow automatically

### Option 2: Using Azure CLI

```bash
# Create a resource group (if needed)
az group create --name antsa-rg --location australiaeast

# Create the static web app
az staticwebapp create \
  --name antsa-landing-page \
  --resource-group antsa-rg \
  --source https://github.com/YOUR_USERNAME/antsa-landing-page \
  --location australiaeast \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### Option 3: GitHub Actions (Automated)

The repository already includes a GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`).

To enable it:

1. Create an Azure Static Web App in the Azure Portal
2. Copy the deployment token from the Static Web App
3. Add it as a GitHub secret:
   - Go to your repository on GitHub
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the deployment token
4. Push to main branch - the workflow will automatically deploy

## Custom Domain (Optional)

After deployment, you can configure a custom domain:

1. Go to your Static Web App in Azure Portal
2. Select "Custom domains" from the left menu
3. Click "Add" and follow the instructions
4. Update your DNS records as specified

## Environment Variables (If Needed)

If you need to add environment variables:

1. Go to your Static Web App in Azure Portal
2. Select "Configuration" from the left menu
3. Add your environment variables
4. Restart the app

## Monitoring

To monitor your application:

1. Go to your Static Web App in Azure Portal
2. Select "Application Insights" from the left menu
3. Enable Application Insights for monitoring and analytics

## Cost

Azure Static Web Apps has a free tier that includes:
- 100 GB bandwidth per month
- Custom domains
- Free SSL certificates
- GitHub integration

For production use, consider the Standard tier for additional features.

## Troubleshooting

### Build Fails

- Check the GitHub Actions logs for errors
- Ensure `npm run build` works locally
- Verify the output directory is `dist`

### 404 Errors

- The `staticwebapp.config.json` should handle routing
- Ensure the configuration file is in the repository root

### Slow Load Times

- Consider implementing code splitting
- Optimize images and assets
- Enable CDN (included with Azure Static Web Apps)

## Support

For issues specific to Azure deployment, refer to:
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Support](https://azure.microsoft.com/support/)

