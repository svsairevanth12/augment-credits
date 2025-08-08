const vscode = require('vscode');
const fetch = require('node-fetch');

let statusBarItem;
let updateInterval;
let context;

/**
 * @param {vscode.ExtensionContext} extensionContext
 */
function activate(extensionContext) {
    context = extensionContext;
    
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'auggieCredits.setPortalLink';
    statusBarItem.show();

    // Register command to set portal link
    const setLinkCommand = vscode.commands.registerCommand('auggieCredits.setPortalLink', async () => {
        const link = await vscode.window.showInputBox({
            prompt: 'Enter your Auggie portal link',
            placeholder: 'https://portal.withorb.com/view?token=...',
            validateInput: (value) => {
                if (!value) return 'Portal link is required';
                if (!value.includes('portal.withorb.com') || !value.includes('token=')) {
                    return 'Please enter a valid Auggie portal link with token';
                }
                return null;
            }
        });

        if (link) {
            await context.globalState.update('auggiePortalLink', link);
            vscode.window.showInformationMessage('Auggie portal link saved successfully!');
            await updateCredits();
            startPolling();
        }
    });
    
    context.subscriptions.push(setLinkCommand);
    context.subscriptions.push(statusBarItem);
    
    // Initialize
    initializeExtension();
}

async function initializeExtension() {
    const savedLink = context.globalState.get('auggiePortalLink');

    if (savedLink) {
        await updateCredits();
        startPolling();
    } else {
        statusBarItem.text = '$(question) Auggie Credits: Click to set link';
        statusBarItem.tooltip = 'Click to set your Auggie portal link';
    }
}

function startPolling() {
    // Clear existing interval
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Update every 45 seconds - less frequent, less annoying
    updateInterval = setInterval(updateCredits, 45 * 1000);
}

async function updateCredits() {
    const portalLink = context.globalState.get('auggiePortalLink');

    if (!portalLink) {
        statusBarItem.text = '$(question) Auggie Credits: No link set';
        statusBarItem.tooltip = 'Click to set your Auggie portal link';
        return;
    }

    try {
        // Silent update - no loading spinner shown to user
        const credits = await fetchCredits(portalLink);

        if (credits !== null) {
            statusBarItem.text = `$(credit-card) Auggie Credits: ${credits}`;
            statusBarItem.tooltip = `Current Auggie credits: ${credits}\nClick to update portal link\nLast updated: ${new Date().toLocaleTimeString()}`;
        } else {
            throw new Error('Could not parse credits from response');
        }

    } catch (error) {
        console.error('Failed to fetch Auggie credits:', error);
        statusBarItem.text = '$(error) Auggie Credits: Error';
        statusBarItem.tooltip = `Failed to fetch credits: ${error.message}\nClick to update portal link`;
    }
}

async function fetchCredits(portalLink) {
    try {
        console.log('Fetching credits from portal:', portalLink);

        // Extract token from the portal link
        const url = new URL(portalLink);
        const token = url.searchParams.get('token');

        if (!token) {
            throw new Error('No token found in portal link');
        }

        console.log('Extracted token:', token);

        // Step 1: Get customer info from the ORB API
        const customerInfoUrl = `https://portal.withorb.com/api/v1/customer_from_link?token=${token}`;
        console.log('Fetching customer info from:', customerInfoUrl);

        const customerResponse = await fetch(customerInfoUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!customerResponse.ok) {
            throw new Error(`Customer API failed: HTTP ${customerResponse.status}: ${customerResponse.statusText}`);
        }

        const customerData = await customerResponse.json();
        console.log('Customer API Response:', customerData);
        console.log('Customer Data Keys:', Object.keys(customerData));

        // Extract customer ID and pricing unit ID from the nested structure
        const customer = customerData.customer;
        const customerId = customer?.id;
        const pricingUnits = customer?.ledger_pricing_units;

        console.log('Extracted Customer Object:', customer);
        console.log('Extracted Customer ID:', customerId);
        console.log('Extracted Pricing Units:', pricingUnits);

        if (!customerId) {
            console.error('Customer data structure:', JSON.stringify(customerData, null, 2));
            throw new Error(`No customer ID found in API response. Available keys: ${Object.keys(customerData).join(', ')}`);
        }

        if (!pricingUnits || pricingUnits.length === 0) {
            console.error('Pricing units data:', pricingUnits);
            throw new Error('No pricing units found in API response');
        }

        console.log('Available pricing units:', pricingUnits.map(unit => ({
            id: unit.id,
            name: unit.name,
            display_name: unit.display_name
        })));

        // Use the first pricing unit (or find the one for "User Messages")
        let pricingUnitId = pricingUnits[0].id;

        // Try to find "User Messages" pricing unit specifically
        const userMessageUnit = pricingUnits.find(unit =>
            unit.name === 'usermessages' ||
            unit.display_name === 'User Messages'
        );

        if (userMessageUnit) {
            pricingUnitId = userMessageUnit.id;
            console.log('✅ Found User Messages pricing unit:', userMessageUnit);
        } else {
            console.log('⚠️ User Messages unit not found, using first unit:', pricingUnits[0]);
        }

        console.log(`🎯 Using Customer ID: ${customerId}, Pricing Unit ID: ${pricingUnitId}`);

        // Step 2: Get ledger summary with the extracted IDs
        const ledgerUrl = `https://portal.withorb.com/api/v1/customers/${customerId}/ledger_summary?pricing_unit_id=${pricingUnitId}&token=${token}`;
        console.log('Fetching ledger summary from:', ledgerUrl);

        const ledgerResponse = await fetch(ledgerUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!ledgerResponse.ok) {
            throw new Error(`Ledger API failed: HTTP ${ledgerResponse.status}: ${ledgerResponse.statusText}`);
        }

        const ledgerData = await ledgerResponse.json();
        console.log('Ledger API Response:', ledgerData);

        // Extract credits_balance from the response
        const creditsBalance = ledgerData.credits_balance;

        if (creditsBalance !== undefined && creditsBalance !== null) {
            const credits = parseFloat(creditsBalance);
            if (!isNaN(credits)) {
                console.log('✅ Successfully got credits from ORB API:', credits);
                return credits;
            }
        }

        throw new Error('Could not find credits_balance in ledger response');

    } catch (error) {
        console.error('Error fetching credits:', error);
        throw error;
    }
}

// Note: HTML parsing functions removed since we now use the proper ORB API endpoints

function deactivate() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
