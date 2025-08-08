# 📦 Publishing Auggie Credits to VS Code Marketplace

> **Complete guide to publish your extension to the official VS Code Marketplace**

## 🎯 Overview

Publishing to the VS Code Marketplace makes your extension available to millions of developers worldwide. Here's how to do it:

## 📋 Prerequisites

### 1. Microsoft Account
- Create a Microsoft account if you don't have one
- This will be used for Azure DevOps

### 2. Azure DevOps Organization
- Sign up at [Azure DevOps](https://dev.azure.com)
- Create a new organization (free)

### 3. Publisher Account
- Create a publisher account on [VS Code Marketplace](https://marketplace.visualstudio.com/manage)

## 🚀 Step-by-Step Publishing Process

### Step 1: Install VSCE (VS Code Extension Manager)
```bash
npm install -g @vscode/vsce
```

### Step 2: Create Personal Access Token
1. Go to [Azure DevOps](https://dev.azure.com)
2. Click on **User Settings** → **Personal Access Tokens**
3. Click **"New Token"**
4. Configure:
   - **Name**: `VS Code Extension Publishing`
   - **Organization**: Select your organization
   - **Expiration**: 1 year (or custom)
   - **Scopes**: Select **"Marketplace (manage)"**
5. **Copy the token** (you won't see it again!)

### Step 3: Create Publisher Profile
1. Go to [VS Code Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Click **"Create Publisher"**
3. Fill in details:
   - **Publisher ID**: `augment-extensions` (or your choice)
   - **Display Name**: `Augment Extensions`
   - **Description**: `High-quality VS Code extensions for developers`

### Step 4: Login with VSCE
```bash
vsce login your-publisher-id
```
Enter your Personal Access Token when prompted.

### Step 5: Update Package.json
```json
{
  "publisher": "your-publisher-id",
  "repository": {
    "type": "git",
    "url": "https://github.com/svsairevanth12/augment-credits.git"
  },
  "bugs": {
    "url": "https://github.com/svsairevanth12/augment-credits/issues"
  },
  "homepage": "https://github.com/svsairevanth12/augment-credits#readme"
}
```

### Step 6: Add License
Create `LICENSE` file:
```
MIT License

Copyright (c) 2025 Augment Code

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

### Step 7: Package and Publish
```bash
# Package the extension
vsce package

# Publish to marketplace
vsce publish
```

## 📊 Marketplace Optimization

### 1. Extension Manifest (package.json)
```json
{
  "categories": ["Other", "Productivity"],
  "keywords": ["auggie", "credits", "tracker", "augment", "usage"],
  "galleryBanner": {
    "color": "#0A0B1A",
    "theme": "dark"
  }
}
```

### 2. README.md Enhancements
- Add **badges** (version, downloads, rating)
- Include **GIF demos** of the extension in action
- Add **feature highlights** with screenshots
- Include **installation instructions**

### 3. Screenshots for Marketplace
Create these images:
- **Hero image** (1200x600) - Extension in action
- **Feature screenshots** (various sizes)
- **Setup process** screenshots

## 🎨 Marketing Assets

### Required Images
1. **Extension Icon** ✅ (Already have: `media/icon.png`)
2. **Gallery Banner** - 1200x600 with robot king theme
3. **Screenshots** - Show extension in VS Code
4. **Demo GIF** - Extension working in real-time

### Optional Assets
- **Video demo** for marketplace
- **Blog post** announcing the extension
- **Social media** graphics

## 🔄 Version Management

### Semantic Versioning
- **1.0.0** - Initial release
- **1.0.1** - Bug fixes
- **1.1.0** - New features
- **2.0.0** - Breaking changes

### Publishing Updates
```bash
# Patch version (1.0.0 → 1.0.1)
vsce publish patch

# Minor version (1.0.0 → 1.1.0)
vsce publish minor

# Major version (1.0.0 → 2.0.0)
vsce publish major
```

## 📈 Post-Publishing

### 1. Monitor Analytics
- Check download stats in marketplace
- Monitor user reviews and ratings
- Track GitHub issues and feedback

### 2. Community Engagement
- Respond to user reviews
- Fix reported bugs quickly
- Add requested features

### 3. Promotion
- Share on social media
- Post in VS Code communities
- Write blog posts about features

## 🛡️ Best Practices

### Security
- ✅ Never include API keys in code
- ✅ Use secure token handling
- ✅ Validate all user inputs

### Performance
- ✅ Minimal startup impact
- ✅ Efficient API calls (45s intervals)
- ✅ Silent background updates

### User Experience
- ✅ Clear error messages
- ✅ Intuitive setup process
- ✅ Helpful tooltips and documentation

## 🎯 Marketplace Categories

Choose appropriate categories:
- **Primary**: `Other`
- **Secondary**: `Productivity`
- **Tags**: `auggie`, `credits`, `tracker`, `augment`, `usage`, `status-bar`

## 📞 Support

### Documentation
- ✅ **SETUP.md** - User setup guide
- ✅ **README.md** - Feature overview
- ✅ **PUBLISHING.md** - This guide

### Community
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community Q&A
- **Wiki** - Extended documentation

---

## 🚀 Quick Publish Checklist

- [ ] Azure DevOps account created
- [ ] Personal Access Token generated
- [ ] Publisher profile created
- [ ] Package.json updated with publisher
- [ ] License file added
- [ ] README.md polished
- [ ] Extension tested locally
- [ ] `vsce package` successful
- [ ] `vsce publish` executed
- [ ] Marketplace listing verified

**Ready to make your Robot King extension available to the world! 🤖👑🌍**
