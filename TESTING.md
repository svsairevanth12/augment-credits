# Testing Guide for Auggie Credits Extension

## 🎯 Build Status

✅ **Build Complete!** Your extension has been successfully packaged.

**Build Output:**
- **VSIX File:** `auggie-credits-1.2.4.vsix` (110.8 KB)
- **Location:** `c:\Users\Venkata\Desktop\augment-credits\`
- **Files Included:** 14 files (extension.js, package.json, media assets, etc.)

---

## 🚀 Method 1: Install VSIX File (Recommended for Testing)

### Step 1: Install the Extension
1. Open VS Code
2. Press `Ctrl+Shift+P` to open Command Palette
3. Type: **"Extensions: Install from VSIX..."**
4. Navigate to: `c:\Users\Venkata\Desktop\augment-credits\`
5. Select: `auggie-credits-1.2.4.vsix`
6. Click **Install**

### Step 2: Reload VS Code
- VS Code will prompt you to reload
- Click **Reload Now** or press `Ctrl+R`

### Step 3: Verify Installation
1. Look at the **bottom-right status bar**
2. You should see: `$(question) Auggie Credits: Click to set link`
3. Click on it to configure your portal link

---

## 🔧 Method 2: Debug Mode (For Development)

### Step 1: Open Extension in VS Code
1. Open this folder in VS Code: `c:\Users\Venkata\Desktop\augment-credits\`
2. Make sure you're in the extension project workspace

### Step 2: Launch Extension Host
**Option A: Using F5**
- Simply press `F5` to start debugging
- A new VS Code window will open with the extension loaded

**Option B: Using Debug Panel**
1. Click the **Run and Debug** icon in the sidebar (or press `Ctrl+Shift+D`)
2. Select **"Run Extension"** from the dropdown
3. Click the green play button (or press `F5`)

### Step 3: Test in Extension Development Host
- A new VS Code window titled **"[Extension Development Host]"** will open
- The extension is now running in this window
- Check the status bar for the Auggie Credits item

---

## 🧪 Testing Checklist

### ✅ Basic Functionality
- [ ] Extension appears in status bar after installation
- [ ] Clicking status bar item prompts for portal link
- [ ] Can enter and save portal link
- [ ] Credits display correctly after configuration
- [ ] Tooltip shows detailed information on hover

### ✅ Commands Testing
Open Command Palette (`Ctrl+Shift+P`) and test:
- [ ] **"Set Auggie Portal Link"** - Opens input box
- [ ] **"Reset Usage A Counter"** - Resets counter A
- [ ] **"Reset Usage B Counter"** - Resets counter B

### ✅ Auto-Update Testing
- [ ] Credits update automatically every 45 seconds
- [ ] Last update time changes in tooltip
- [ ] No loading spinners or disruptions during updates

### ✅ Usage Counters
- [ ] Reset Usage A shows correct baseline
- [ ] Reset Usage B shows correct baseline
- [ ] Status bar displays: `774,450 | A: -1,250 | B: -500` format
- [ ] Negative values indicate consumed credits
- [ ] Positive values indicate added credits

### ✅ Error Handling
- [ ] Invalid portal link shows validation error
- [ ] Network errors display error message in status bar
- [ ] Missing token shows appropriate error

### ✅ Tooltip Information
Hover over status bar item and verify:
- [ ] Current credit balance
- [ ] Last update timestamp
- [ ] Usage A/B details (if set)
- [ ] Credit blocks with expiry dates
- [ ] Command instructions

---

## 🐛 Debugging Tips

### View Extension Logs
1. In the Extension Development Host window
2. Press `Ctrl+Shift+U` to open Output panel
3. Select **"Log (Extension Host)"** from dropdown
4. Look for messages starting with "Auggie Credits"

### View Developer Console
1. In the Extension Development Host window
2. Press `Ctrl+Shift+I` to open Developer Tools
3. Check the **Console** tab for errors or logs

### Common Issues

**Issue: Extension not appearing in status bar**
- Solution: Reload the window (`Ctrl+R`)
- Check: Extensions view to ensure it's enabled

**Issue: "No compilation needed" warning**
- This is normal - the extension uses plain JavaScript
- No build step required

**Issue: VSIX installation fails**
- Solution: Close all VS Code windows and try again
- Check: Make sure you're not trying to install while debugging

---

## 📊 What's Working vs Not Working

### ✅ What Should Work
1. **Status Bar Display** - Shows credits in real-time
2. **Portal Link Configuration** - Saves and validates link
3. **Auto-Updates** - Fetches credits every 45 seconds
4. **Usage Counters** - Tracks A/B usage independently
5. **Credit Blocks** - Shows expiry dates in tooltip
6. **Commands** - All three commands functional
7. **Error Handling** - Graceful error messages

### 🔍 Things to Test
1. **API Connectivity** - Does it fetch from ORB API?
2. **Token Extraction** - Does it parse the portal URL correctly?
3. **Credit Parsing** - Does it display the correct balance?
4. **Persistence** - Does the link persist across VS Code restarts?
5. **Multiple Counters** - Do A/B counters work independently?

---

## 🔄 Rebuilding After Changes

If you make changes to the code:

### For VSIX Testing:
```powershell
# Rebuild the VSIX
npx vsce package

# Uninstall old version (in VS Code Extensions view)
# Then reinstall the new VSIX file
```

### For Debug Mode:
- Just press `F5` again
- Or click the green restart button in the debug toolbar
- Changes are automatically reloaded

---

## 📝 Test Scenarios

### Scenario 1: First-Time Setup
1. Install extension
2. Click status bar item
3. Enter portal link from Augment account
4. Verify credits appear

### Scenario 2: Usage Tracking
1. Reset Usage A counter
2. Work for 1 hour
3. Check Usage A shows consumed credits
4. Reset Usage B for specific task
5. Complete task and check Usage B

### Scenario 3: Error Recovery
1. Enter invalid portal link
2. Verify error message
3. Enter correct link
4. Verify recovery and display

### Scenario 4: Persistence
1. Configure portal link
2. Close VS Code completely
3. Reopen VS Code
4. Verify credits still display without reconfiguration

---

## 🎉 Success Criteria

Your extension is working correctly if:
- ✅ Status bar shows credit balance
- ✅ Updates happen automatically every 45 seconds
- ✅ Tooltip shows detailed breakdown
- ✅ Commands execute without errors
- ✅ Usage counters track consumption
- ✅ Settings persist across sessions

---

## 📞 Next Steps

1. **Test the extension** using Method 1 or Method 2
2. **Report any issues** you find
3. **Verify all features** from the checklist
4. **Test edge cases** (network errors, invalid tokens, etc.)

If you encounter any issues, check the logs and developer console for detailed error messages.

Happy Testing! 🚀

