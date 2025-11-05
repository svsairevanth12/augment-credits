# Auggie Credits

Track your Auggie credits in real-time directly in your VS Code status bar.

## Features

- **Real-time Credit Tracking** - Automatically updates every 45 seconds
- **Trip Odometer Counters** - Track credit usage with two independent Usage A/B counters
- **Credit Block Breakdown** - View your credit allocations and expiry dates
- **Silent Background Updates** - No disruptive loading indicators
- **Clean Status Bar Integration** - Displays credits with clear iconography
- **Simple Setup** - One-time configuration with your portal link
- **Secure Token Handling** - Uses official ORB API endpoints

## Setup Guide

### Step 1: Access Your Augment Account
1. Navigate to [Augment Code Account](https://app.augmentcode.com/account/subscription)
2. Log in to your account

### Step 2: Open Browser Developer Tools
1. On the subscription page, open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
2. Navigate to the **Network** tab in Developer Tools

### Step 3: View Your Usage
1. With the Network tab open, click the **"View Usage"** button on the subscription page

![View Usage Button](https://raw.githubusercontent.com/svsairevanth12/augment-credits/main/media/credits.png)

### Step 4: Extract Your Portal URL
1. In the Network tab, look for a request to `subscription` (full URL: `https://app.augmentcode.com/api/subscription`)
2. Click on this request to view its details
3. In the **Response** tab, you'll see JSON data containing a `portalUrl` field
4. Copy the **entire URL** from the `portalUrl` field (it looks like: `https://portal.withorb.com/view?token=ABC123xyz...`)

**Example response:**
```json
{
    "portalUrl": "https://portal.withorb.com/view?token=YOUR_TOKEN_HERE",
    "planName": "Developer Plan",
    ...
}
```

> **Note**: Your token is personal and should be kept secure. Do not share it publicly.

### Step 5: Configure the Extension
1. In VS Code, look at the **bottom-right status bar**
2. Click on the **"Auggie Credits"** item

![Status Bar Location](https://raw.githubusercontent.com/svsairevanth12/augment-credits/main/media/image.png)

3. When prompted, paste the portal URL you copied from Step 4
4. Press Enter to save

![Paste Portal Link](https://raw.githubusercontent.com/svsairevanth12/augment-credits/main/media/Screenshot%202025-08-09%20002054.png)

### Step 6: Verify Setup
Your credits will now appear in the status bar as: `774,450`
- Updates automatically every 45 seconds
- Hover over the status bar item to see detailed information



## Usage

### Status Bar Display

The extension displays your credit balance in the VS Code status bar with different states:

- **Active**: `774,450` - Shows current credit balance
- **With Usage Counters**: `774,450 | A: -1,250 | B: -500` - Shows balance and usage since reset
- **Error**: `Auggie Credits: Error` - Indicates connection or authentication issues
- **Setup Required**: `Auggie Credits: Click to set link` - Prompts for initial configuration

### Trip Odometer Feature

Track your credit consumption over specific time periods using two independent counters:

**Usage A Counter** - Perfect for tracking daily usage
- Reset at the start of your workday
- See how many credits you've consumed throughout the day

**Usage B Counter** - Perfect for tracking task-specific usage
- Reset when starting a specific task or project
- See exactly how many credits that work consumed

**How to use:**
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Auggie Credits: Reset Usage A Counter" or "Reset Usage B Counter"
3. The counter will be set to your current credit balance
4. The status bar will show: `774,450 | A: -1,250` (negative = consumed, positive = added)

**Example workflow:**
```
Morning:   Reset Usage A → 774,450 | A: -0
Task 1:    Reset Usage B → 774,450 | A: -0 | B: -0
After 1hr: Current state → 773,200 | A: -1,250 | B: -1,250
Task 2:    Reset Usage B → 773,200 | A: -1,250 | B: -0
End of day: Final state  → 770,000 | A: -4,450 | B: -3,200
```

### Detailed Tooltip

Hover over the status bar item to see:
- Current credit balance
- Last update time
- Usage A/B details (if counters are set)
- Credit block breakdown with expiry dates
- Available commands

**Example tooltip:**
```
Current Auggie credits: 774,450
Last updated: 3:45:23 PM

Usage A: -1,250 credits since reset
Usage B: -500 credits since reset

Credit Blocks:
  25,350 expires 11/22/2025
  485,200 expires 11/22/2025
  56,000 expires 1/28/2026
  207,900 expires 9/18/2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Commands (Ctrl+Shift+P):
  • Reset Usage A Counter
  • Reset Usage B Counter
  • Set Auggie Portal Link
```

## Commands

| Command | Description |
|---------|-------------|
| `Set Auggie Portal Link` | Configure your ORB portal link for credit tracking |
| `Reset Usage A Counter` | Reset Usage A to current balance (track daily usage) |
| `Reset Usage B Counter` | Reset Usage B to current balance (track task usage) |

Access commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)

## Configuration

No additional configuration required. The extension automatically:
- Extracts authentication tokens from your portal link
- Connects to ORB API endpoints securely
- Updates credit balance every 45 seconds
- Persists settings across VS Code sessions

## Requirements

- VS Code 1.74.0 or higher
- Active Augment Code subscription
- Internet connection

## Troubleshooting

### "No customer ID found" Error
- **Solution**: Ensure you copied the complete portal URL from the subscription API response
- **Check**: URL should contain `portal.withorb.com` and `token=`
- **Verify**: Make sure you extracted the URL from the `portalUrl` field in the JSON response

### "Failed to fetch credits" Error
- **Solution**: Verify your internet connection and that the portal link is still valid
- **Check**: Try getting a fresh portal URL from the subscription endpoint
- **Note**: Portal tokens may expire; obtain a new one if needed

### Extension Not Showing
- **Solution**: Restart VS Code after installation
- **Check**: Verify the extension is installed and enabled in Extensions view

### Can't Find the Subscription Request
- **Solution**: Make sure the Network tab is open **before** clicking "View Usage"
- **Tip**: Clear the network log and click "View Usage" again to see fresh requests
- **Filter**: Type "subscription" in the Network tab filter to find it quickly

### Updating Your Portal Link
If you need to change your portal link:
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type: "Set Auggie Portal Link"
3. Paste your new portal URL

### Resetting Usage Counters
To clear a usage counter:
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type: "Reset Usage A Counter" or "Reset Usage B Counter"
3. The counter will be set to your current balance

## Privacy & Security

- Your portal token is stored locally in VS Code's secure storage
- The extension only communicates with official Orb API endpoints
- No data is sent to third parties
- Usage counters are stored locally and never transmitted


