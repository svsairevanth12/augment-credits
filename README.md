# 🤖👑 Auggie Credits - VS Code Extension

> **Track your Auggie credits in real-time directly in your VS Code status bar!**

![Auggie Credits](media/logo.svg)

## ✨ Features

- 🔄 **Real-time Credit Tracking** - Updates every 45 seconds
- 👑 **Awesome Robot King Design** - Custom designed logo and branding
- 🚀 **Silent Updates** - No annoying loading spinners
- 💎 **Clean Status Bar** - Shows credits with beautiful icons
- 🔗 **Easy Setup** - Just paste your portal link once

## 🎯 How It Works

1. **Set Your Portal Link** - Use Command Palette: "Set Auggie Portal Link"
2. **Paste Your URL** - `https://portal.withorb.com/view?token=...`
3. **Watch Your Credits** - Status bar shows: `$(credit-card) Auggie Credits: 4009`

## 🚀 Installation

### From VSIX (Recommended)
```bash
code --install-extension auggie-credits-1.0.0.vsix
```

### From Source
```bash
git clone https://github.com/svsairevanth12/augment-credits.git
cd augment-credits
npm install
npx vsce package
code --install-extension auggie-credits-1.0.0.vsix
```

## 🎨 Screenshots

The extension displays your credits in the VS Code status bar:
- **Active**: `$(credit-card) Auggie Credits: 4009`
- **Loading**: Silent updates (no spinner!)
- **Error**: `$(error) Auggie Credits: Error`
- **Setup**: `$(question) Auggie Credits: Click to set link`

## ⚙️ Commands

| Command | Description |
|---------|-------------|
| `Set Auggie Portal Link` | Configure your ORB portal link |

## 🔧 Configuration

No configuration needed! Just set your portal link and you're ready to go.

## 🤖 API Integration

The extension uses the official ORB API:
1. Extracts token from your portal link
2. Calls `/api/v1/customer_from_link?token=` to get customer info
3. Calls `/api/v1/customers/{id}/ledger_summary` to get credit balance
4. Updates status bar with current credits

## 🎭 Design

- **Robot King Theme** - Futuristic crowned robot design
- **Neon Gradients** - Purple to cyan color scheme
- **Professional Icons** - Credit card and status indicators
- **Clean Typography** - Easy to read in status bar

## 🔄 Update Frequency

- **Interval**: Every 45 seconds
- **Method**: Silent background updates
- **Tooltip**: Shows last update timestamp

## 🛠️ Development

```bash
# Install dependencies
npm install

# Package extension
npx vsce package

# Install locally
code --install-extension auggie-credits-1.0.0.vsix
```

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🎉 Credits

- **Design**: Custom Robot King logo and branding
- **API**: ORB portal integration
- **Framework**: VS Code Extension API

---

**Made with 💜 for the Augment community**

*Track your credits like a king! 🤖👑*
