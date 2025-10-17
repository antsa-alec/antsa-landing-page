# DNS Configuration for antsa.ai

To point your custom domain `antsa.ai` to the Azure App Service, add these DNS records in your domain registrar:

## Required DNS Records

### 1. A Record (for apex domain antsa.ai)
```
Type: A
Name: @
Value: 20.211.64.7
TTL: 3600
```

### 2. TXT Record (for domain verification)
```
Type: TXT
Name: asuid
Value: 51b82d495a4f41e074efa3de0f789ad814291ffe02a2d9e1bdb63564d448e85c
TTL: 3600
```

### 3. CNAME Record (for www subdomain - optional)
```
Type: CNAME
Name: www
Value: antsa-landing-au-production.azurewebsites.net
TTL: 3600
```

## After Adding DNS Records

1. Wait 10-30 minutes for DNS propagation
2. Run this command to add the custom domain:
   ```bash
   az webapp config hostname add --webapp-name antsa-landing-au-production --resource-group production --hostname antsa.ai
   ```

3. Enable HTTPS (after domain is verified):
   ```bash
   az webapp config ssl bind --name antsa-landing-au-production --resource-group production --certificate-thumbprint auto --ssl-type SNI
   ```

## Verify DNS Propagation

Check if DNS is working:
```bash
nslookup antsa.ai
dig antsa.ai
```

