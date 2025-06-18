# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated deployment and CI/CD.

## 📁 Files

- **`main.yml`** - Automated deployment to Civo Kubernetes

## 🚀 Main Deployment Workflow

The `main.yml` workflow automatically deploys the Password Vault Generator to Civo Kubernetes whenever code is pushed to the `main` branch.

### Workflow Steps

1. **📥 Checkout Code** - Downloads the repository code
2. **🏷️ Set Image Tag** - Creates a version tag from git commit SHA
3. **🐳 Build Docker Image** - Builds and pushes to GitHub Container Registry
4. **☸️ Deploy to Kubernetes** - Applies all manifests and updates deployment

### Required Secrets

The workflow requires the following GitHub repository secrets:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `KUBE_CONFIG` | Base64 encoded kubeconfig file | See setup instructions below |

### Setting Up KUBE_CONFIG Secret

1. **Get your kubeconfig from Civo:**
   ```bash
   # Download kubeconfig from Civo dashboard or CLI
   civo k8s config your-cluster-name --save
   ```

2. **Encode it to base64:**
   ```bash
   cat ~/.kube/config | base64 -w 0
   ```

3. **Add to GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `KUBE_CONFIG`
   - Value: The base64 encoded string from step 2

### Environment Configuration

The workflow automatically applies the ConfigMap with Civo branding enabled:

```yaml
# k8s/configmap.yaml
data:
  NEXT_PUBLIC_HOSTED_ON: "civo"  # Enables Civo branding
```

This will make the Civo banner appear at the top of the application when deployed.

### Deployment Verification

The workflow includes several verification steps:

- ✅ Checks if pods are running
- ✅ Verifies ConfigMap is applied
- ✅ Confirms Civo branding is enabled
- ✅ Shows deployment status

### Manual Deployment

To deploy manually without GitHub Actions:

```bash
# Set image tag
export IMAGE_TAG=$(git rev-parse --short HEAD)

# Update deployment with new tag
sed -i "s|ghcr.io/keithhubner/passwordvaultgenerator:.*|ghcr.io/keithhubner/passwordvaultgenerator:$IMAGE_TAG|" k8s/deployment.yaml

# Apply all manifests
kubectl apply -f k8s/

# Check deployment
kubectl get pods -n password-vault-generator
```

### Troubleshooting

**❌ "Error from server (Forbidden)"**
- Check if KUBE_CONFIG secret is properly set
- Verify the kubeconfig has correct permissions

**❌ "Image pull errors"**
- Ensure GitHub Container Registry permissions are correct
- Check if the image was built and pushed successfully

**❌ "ConfigMap not found"**
- The workflow applies manifests in the correct order
- Check if the namespace was created first

### Monitoring Deployments

You can monitor deployments in the GitHub Actions tab:

1. Go to your repository
2. Click "Actions" tab
3. Click on the latest workflow run
4. Expand the "Deploy to Civo Kubernetes" step to see logs

The logs will show:
- Image tag being used
- Kubernetes apply results
- Pod status
- ConfigMap verification
- Civo branding status