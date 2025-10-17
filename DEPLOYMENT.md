# Deployment Guide

## Prerequisites

1. **DNS Configuration**: Add the required DNS records (see DNS_SETUP.md)
2. **GitHub Secrets**: Add the Azure publish profile to GitHub

## GitHub Secrets Setup

### 1. Add AZURE_WEBAPP_PUBLISH_PROFILE

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

**Name:** `AZURE_WEBAPP_PUBLISH_PROFILE`

**Value:** (Use the publish profile from Azure)

To get the publish profile, run:
```bash
az webapp deployment list-publishing-profiles --name antsa-landing-au-production --resource-group production --xml
```

Copy the entire XML output and paste it as the secret value.

## Automatic Deployment

The application automatically deploys when you push to the `master` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin master
```

The GitHub Actions workflow will:
1. ✅ Install dependencies
2. ✅ Build the frontend (Vite + React)
3. ✅ Install backend dependencies
4. ✅ Create deployment package
5. ✅ Deploy to Azure App Service

## Environment Variables (Already Configured in Azure)

The following environment variables are set in Azure App Service:
- `NODE_ENV=production`
- `PORT=8080`
- `JWT_SECRET=[auto-generated secure random string]`
- `ALLOWED_ORIGINS=https://antsa.ai,https://www.antsa.ai,https://antsa-landing-au-production.azurewebsites.net`

## Manual Deployment (Not Recommended)

If you need to deploy manually:
```bash
npm run build
az webapp deploy --name antsa-landing-au-production --resource-group production --src-path ./deploy.zip
```

## Post-Deployment Steps

1. **Verify DNS propagation**:
   ```bash
   nslookup antsa.ai
   ```

2. **Add custom domain** (after DNS is propagated):
   ```bash
   az webapp config hostname add --webapp-name antsa-landing-au-production --resource-group production --hostname antsa.ai
   ```

3. **Enable HTTPS** (free managed certificate):
   ```bash
   az webapp config ssl bind --name antsa-landing-au-production --resource-group production --certificate-thumbprint auto --ssl-type SNI
   ```

4. **Initialize database** (first time only):
   SSH into the Azure app or run initialization script to:
   - Run `backend/scripts/seed.js` to create initial database
   - Run `backend/scripts/update-admin.js` to set admin credentials

## Monitoring

- **Azure Portal**: https://portal.azure.com → App Services → antsa-landing-au-production
- **Logs**: View in Azure Portal → Log stream
- **GitHub Actions**: Check workflow runs in your repo's Actions tab

## Troubleshooting

### Build fails in GitHub Actions
- Check the Actions tab for detailed error logs
- Ensure all dependencies are in package.json

### App doesn't start after deployment
- Check Azure Log Stream for errors
- Verify startup.sh is executable
- Check environment variables are set

### Database not persisting
- SQLite database is stored in `/home/site/wwwroot/backend/`
- Consider using Azure Database for PostgreSQL for production

## Rollback

To rollback to a previous deployment:
1. Go to Azure Portal → App Services → antsa-landing-au-production → Deployment Center
2. Select a previous deployment from the history
3. Click "Redeploy"
