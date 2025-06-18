# Kubernetes Deployment

This folder contains Kubernetes manifests for deploying the Password Vault Generator application.

## 📁 Files

- **`namespace.yaml`** - Kubernetes namespace for the application
- **`configmap.yaml`** - Environment variables and configuration
- **`deployment.yaml`** - Application deployment specification  
- **`service.yaml`** - Internal service for pod communication

## 🚀 Quick Deploy

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or apply individually (in order)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 🌐 Environment Configuration

### Civo Branding

The app displays Civo branding when deployed on Civo. This is controlled by the `NEXT_PUBLIC_HOSTED_ON` environment variable in `configmap.yaml`:

```yaml
data:
  NEXT_PUBLIC_HOSTED_ON: "civo"  # Shows Civo branding
  # NEXT_PUBLIC_HOSTED_ON: ""   # Hides branding
```

### Other Hosting Providers

To add branding for other providers:

1. **Update ConfigMap**:
   ```yaml
   NEXT_PUBLIC_HOSTED_ON: "your-provider"
   ```

2. **Add Provider Logic** in `components/CivoBranding.tsx`:
   ```typescript
   if (hostedOn === "your-provider") {
     // Your provider branding logic
   }
   ```

## 🔧 Configuration Options

### Resource Limits

Current settings in `deployment.yaml`:
```yaml
resources:
  limits:
    memory: "512Mi"
    cpu: "500m"
  requests:
    memory: "256Mi" 
    cpu: "250m"
```

### Scaling

To scale the application:
```bash
kubectl scale deployment password-vault-generator --replicas=3 -n password-vault-generator
```

### Image Updates

Update the image in `deployment.yaml`:
```yaml
image: ghcr.io/keithhubner/passwordvaultgenerator:v1.2.0
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ConfigMap     │    │   Deployment    │    │    Service      │
│                 │────│                 │────│                 │
│ Environment     │    │ App Containers  │    │ Load Balancer   │
│ Variables       │    │ Resource Limits │    │ Port Mapping    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Monitoring

Check deployment status:
```bash
# Pod status
kubectl get pods -n password-vault-generator

# Deployment status  
kubectl get deployment -n password-vault-generator

# Service status
kubectl get service -n password-vault-generator

# Logs
kubectl logs -f deployment/password-vault-generator -n password-vault-generator
```

## 🛠️ Troubleshooting

### Common Issues

**Pod Not Starting:**
```bash
kubectl describe pod <pod-name> -n password-vault-generator
```

**Image Pull Issues:**
- Check the `ghcr-secret` exists
- Verify image tag exists in registry

**Environment Variables:**
```bash
kubectl exec -it <pod-name> -n password-vault-generator -- env | grep NEXT_PUBLIC
```

### Useful Commands

```bash
# Restart deployment
kubectl rollout restart deployment/password-vault-generator -n password-vault-generator

# Check ConfigMap
kubectl get configmap nextjs-config -n password-vault-generator -o yaml

# Port forward for local testing
kubectl port-forward service/password-vault-generator 8080:80 -n password-vault-generator
```

## 🔒 Security Notes

- Environment variables are stored in ConfigMap (not encrypted)
- For sensitive data, use Secrets instead of ConfigMap
- The app runs as non-root user in container
- Network policies can be added for additional isolation