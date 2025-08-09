# Auggie Credits

Track your Auggie credits in real-time directly in your VS Code status bar.

## Features

- **Real-time Credit Tracking** - Automatically updates every 45 seconds
- **Silent Background Updates** - No disruptive loading indicators
- **Clean Status Bar Integration** - Displays credits with clear iconography
- **Simple Setup** - One-time configuration with your portal link
- **Secure Token Handling** - Uses official ORB API endpoints

## Quick Start

1. Install the extension
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run "Set Auggie Portal Link"
4. Paste your portal URL: `https://portal.withorb.com/view?token=...`
5. Your credits will appear in the status bar

## Installation

### From VS Code Marketplace
```
ext install augment-extensions.auggie-credits
```

### From VSIX Package
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

For detailed setup instructions with screenshots, see [SETUP.md](SETUP.md).

## Usage

The extension displays your credit balance in the VS Code status bar with different states:

- **Active**: `Auggie Credits: 4009` - Shows current credit balance
- **Error**: `Auggie Credits: Error` - Indicates connection or authentication issues
- **Setup Required**: `Auggie Credits: Click to set link` - Prompts for initial configuration

## Commands

| Command | Description |
|---------|-------------|
| `Set Auggie Portal Link` | Configure your ORB portal link for credit tracking |

Access commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)

## Configuration

No additional configuration required. The extension automatically:
- Extracts authentication tokens from your portal link
- Connects to ORB API endpoints securely
- Updates credit balance every 45 seconds
- Persists settings across VS Code sessions

## How It Works

The extension integrates with the ORB API to provide real-time credit tracking:

1. **Token Extraction** - Parses authentication token from your portal link
2. **Customer Lookup** - Calls `/api/v1/customer_from_link?token=` to retrieve account information
3. **Credit Retrieval** - Fetches current balance via `/api/v1/customers/{id}/ledger_summary`
4. **Status Display** - Updates VS Code status bar with current credit count

## Update Behavior

- **Frequency**: Automatic updates every 45 seconds
- **Method**: Silent background requests without UI interruption
- **Persistence**: Settings and last known balance persist across VS Code restarts
- **Error Handling**: Graceful degradation with clear error messaging

## Development

### Prerequisites
- Node.js 16.x or higher
- VS Code 1.74.0 or higher

### Setup
```bash
# Clone repository
git clone https://github.com/svsairevanth12/augment-credits.git
cd augment-credits

# Install dependencies
npm install

# Package extension
npx vsce package

# Install locally for testing
code --install-extension auggie-credits-1.0.0.vsix
```

### Publishing
For complete VS Code Marketplace publishing instructions, see [PUBLISHING.md](PUBLISHING.md).

## Requirements

- VS Code 1.74.0 or higher
- Active Augment Code subscription
- Internet connection for API access

## Known Issues

- Initial setup requires manual portal link configuration
- Credit updates depend on ORB API availability

## Release Notes

### 1.0.0
- Initial release
- Real-time credit tracking
- Status bar integration
- ORB API integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/svsairevanth12/augment-credits/issues)
- **Documentation**: [Setup Guide](SETUP.md)
- **Repository**: [GitHub](https://github.com/svsairevanth12/augment-credits)
