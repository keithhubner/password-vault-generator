# Password Vault Generator

🔐 Generate realistic test data for password managers including Bitwarden, LastPass, Keeper, Microsoft Edge, KeePassX, KeePass2, and Password Depot.

Perfect for testing password manager integrations, security audits, and development workflows.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Development-orange?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/keithhubner)

## ✨ What This Tool Does

- 🏢 **Generate test vaults** with realistic business data
- 🔑 **Create weak passwords** for security testing
- 📊 **Export multiple formats** (JSON, CSV, XML)
- 🏗️ **Nested folders/collections** for complex organizational structures
- ⚡ **Handle large datasets** (up to 10,000 items) with progress tracking

## 🚀 Quick Start

### 1. Prerequisites
You need **Node.js 18 or newer** installed on your computer.

**Check if you have Node.js:**
```bash
node --version
```

**Don't have Node.js?** Download it from [nodejs.org](https://nodejs.org/)

### 2. Get the Code
```bash
# Clone this repository
git clone https://github.com/keithhubner/password-vault-generator.git

# Go into the project folder
cd password-vault-generator
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Optional: Configure environment variables
cp .env.example .env

# Start the application
npm run dev
```

### 4. Open Your Browser
Go to **http://localhost:3000** and start generating vault data!

## 📋 How to Use

### Basic Usage
1. **Choose your vault format** (Bitwarden, LastPass, etc.)
2. **Set item counts** (logins, notes, cards, identities)
3. **Click "Generate Vault"**
4. **Download** your test data

### Advanced Features
- **Weak Passwords**: Enable for security testing (configurable percentage)
- **Password Reuse**: Simulate real-world password habits
- **Real URLs**: Use actual website domains vs. fake ones
- **Nested Collections**: Create hierarchical folder structures
- **Large Datasets**: Generate thousands of items with progress tracking

## 💡 Use Cases

### For Developers
- **API Testing**: Generate realistic data for password manager integrations
- **Database Seeding**: Populate test environments with structured vault data
- **UI/UX Testing**: Test how your app handles large datasets and various formats

### For Security Teams
- **Password Audits**: Generate datasets with known weak passwords for testing detection tools
- **Penetration Testing**: Create realistic vaults to test security scanning tools
- **Compliance Testing**: Validate how systems handle different vault structures

### For DevOps
- **Migration Testing**: Test data migration between different password managers
- **Backup Testing**: Validate backup and restore procedures with realistic data
- **Performance Testing**: Stress test systems with large vault datasets

## 🎯 Supported Export Formats

| Password Manager | Export Format | Features |
|-----------------|---------------|----------|
| **Bitwarden** | JSON | Individual/Organization vaults, nested collections, TOTP |
| **LastPass** | CSV | Simple format, groupings, TOTP secrets |
| **Keeper** | JSON/CSV | Nested folders, shared folders, custom fields |
| **Microsoft Edge** | CSV | Basic password export format |
| **KeePassX** | CSV | Simple database export |
| **KeePass2** | XML | Full database with groups, entries, metadata |
| **Password Depot** | CSV | Semicolon-separated format with importance levels, categories |

## ⚙️ Configuration Options

### Security Testing
- **Weak Password %**: Set percentage of passwords that are weak/common
- **Password Reuse %**: Simulate users reusing passwords across sites
- **Real URLs**: Use actual domains (google.com, facebook.com) vs fake ones

### Data Volume
- **Login Items**: 0-10,000 password entries
- **Secure Notes**: Text notes with metadata
- **Credit Cards**: Payment card information
- **Identity Items**: Personal information (name, address, etc.)

### Organization Structure
- **Nested Collections**: Create folder hierarchies (Finance/Accounting/Invoices)
- **Business Departments**: Use realistic department names
- **Collection Distribution**: Automatically assign items to collections

## 🌐 Environment Configuration

### Hosting Provider Branding

To display hosting provider branding (like Civo), set environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set:
NEXT_PUBLIC_HOSTED_ON=civo
```

**Supported Providers:**
- `civo` - Displays Civo branding with link to civo.com
- Leave empty to hide branding

**Logo Setup:**
- Current logos in `public/img/` are **placeholders**
- Replace `civo-logo.svg` and `civo-logo.jpg` with official Civo brand assets
- Follow Civo branding guidelines for proper usage
- See `public/img/README.md` for detailed instructions

## 🔧 Building & Development

Want to modify the code? Here are the developer commands:

```bash
# Check TypeScript types
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## ☸️ Kubernetes Deployment

Deploy to Kubernetes (like Civo) using the provided manifests:

```bash
# Deploy all components
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n password-vault-generator
```

The app will automatically show Civo branding when `NEXT_PUBLIC_HOSTED_ON=civo` is set in the ConfigMap.

📖 **See [k8s/README.md](k8s/README.md) for detailed deployment instructions**

## 📝 Step-by-Step Examples

### Example 1: Basic Bitwarden Export
**Goal**: Create a simple Bitwarden vault for testing
```
1. Open http://localhost:3000
2. Select "Bitwarden" as vault format
3. Keep "Individual" vault type selected
4. Set "Number of Logins" to 50
5. Click "Generate Vault" 
6. Click "Download JSON"
```
**Result**: You'll get a JSON file with 50 realistic login entries

### Example 2: Security Testing Dataset
**Goal**: Test your password manager's security scanning
```
1. Select any vault format
2. Check "Include weak passwords" 
3. Set weak password percentage to 40%
4. Check "Reuse passwords across multiple sites"
5. Set password reuse to 30%
6. Generate 200+ login items
7. Import into your password manager
8. Run security audit to see weak/reused passwords detected
```

### Example 3: Large Organization Vault
**Goal**: Test how your system handles enterprise data
```
1. Select "Bitwarden" format
2. Choose "Organization" vault type  
3. Check "Create collections for business departments"
4. Check "Use nested collections"
5. Set total collections to 50
6. Set logins to 1000, notes to 100, cards to 50
7. Check "Assign items to collections"
8. Generate and download
```

### Example 4: Password Depot CSV Export
**Goal**: Generate Password Depot compatible data for migration testing
```
1. Select "Password Depot" as vault format
2. Set "Number of Logins" to 100
3. Check "Include weak passwords" and set to 25%
4. Check "Use real website URLs" 
5. Click "Generate Vault"
6. Click "Download CSV"
```
**Result**: You'll get a semicolon-separated CSV file with fields: Description, Importance, Password, Last modified, Expiry Date, User Name, URL, Comments, and Category

## 🐛 Troubleshooting

### Common Issues

**❌ "next: command not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**❌ Port 3000 already in use**
```bash
# Use a different port
npm run dev -- -p 3001
```

**❌ Out of memory errors with large datasets**
- Try generating smaller batches (< 5000 items)
- Close other applications to free memory
- Use the progress indicator to monitor generation

## 🤝 Contributing

Found a bug? Want to add a new password manager format? Contributions are welcome!

1. **Fork** this repository
2. **Create** a new branch (`git checkout -b feature/my-feature`)
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Ideas for Contributions
- 🆕 New password manager formats (1Password, Dashlane, etc.)
- 🎨 UI improvements and better user experience
- 🚀 Performance optimizations for larger datasets
- 🧪 Additional test scenarios and edge cases
- 📖 Documentation and examples

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use, modify, and distribute this code freely, even commercially, just keep the copyright notice.

## ❓ Need Help?

- 📚 **Documentation**: You're reading it! Scroll up for detailed guides
- 🐛 **Bug Reports**: [Open an issue](https://github.com/keithhubner/password-vault-generator/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/keithhubner/password-vault-generator/discussions)
- 📧 **Questions**: Check existing issues or create a new one
- ☕ **Support Development**: [Buy me a coffee](https://buymeacoffee.com/keithhubner) if this tool helped you!

## ⚠️ Important Notes

🎯 **This is a testing tool** - Generated data is for development and testing only
🔐 **Not for production** - Don't use generated passwords in real accounts  
🧪 **Perfect for testing** - Ideal for QA, security audits, and development workflows
