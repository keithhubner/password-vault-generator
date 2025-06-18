# Branding Images

This folder contains hosting provider logos for branding purposes.

## 📁 Files

- **`civo-logo.svg`** - Civo logo (SVG format, preferred)
- **`civo-logo.jpg`** - Civo logo (JPG format, fallback)

## 🎨 Civo Branding Guidelines

### Current Placeholders

The current files are **placeholders** and should be replaced with official Civo brand assets:

- `civo-logo.svg` - Replace with official Civo SVG logo
- `civo-logo.jpg` - Replace with official Civo JPG logo

### Logo Specifications

**Recommended Dimensions:**
- Width: 120-150px 
- Height: 40-50px
- Format: SVG (preferred) or high-quality JPG/PNG
- Background: Transparent (for SVG/PNG)

### Branding Guidelines

Follow Civo's official branding guidelines:
- Use official Civo logos only
- Maintain proper aspect ratio
- Ensure sufficient contrast
- Don't modify colors or proportions
- Include proper attribution if required

### Usage

The logo appears when `NEXT_PUBLIC_HOSTED_ON=civo` is set:
- Displays at the top center of the application
- Links to https://www.civo.com
- Shows on hover with opacity transition
- Alt text: "Hosted on Civo"

### Adding Other Providers

To add branding for other hosting providers:

1. **Add logo files:**
   ```
   public/img/
   ├── provider-logo.svg
   └── provider-logo.jpg
   ```

2. **Update CivoBranding component:**
   ```typescript
   // In components/CivoBranding.tsx
   if (hostedOn === "your-provider") {
     // Add your provider logic
   }
   ```

3. **Set environment variable:**
   ```yaml
   # In k8s/configmap.yaml
   NEXT_PUBLIC_HOSTED_ON: "your-provider"
   ```

## 🔗 Resources

- [Civo Brand Assets](https://www.civo.com/brand-assets) - Official logos and guidelines
- [Civo Website](https://www.civo.com) - Main website
- [Civo Documentation](https://www.civo.com/docs) - Technical documentation