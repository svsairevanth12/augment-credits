const vscode = require('vscode');
const https = require('https');
const { URL } = require('url');

let statusBarItem;
let updateInterval;
let context;

// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper function to make HTTPS requests (replaces node-fetch)
function httpsRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: options.timeout || 15000
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    json: () => Promise.resolve(JSON.parse(data)),
                    text: () => Promise.resolve(data)
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * @param {vscode.ExtensionContext} extensionContext
 */
function activate(extensionContext) {
    console.log('Auggie Credits extension is now active!');
    context = extensionContext;

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'auggieCredits.setPortalLink';
    statusBarItem.text = '$(question) Auggie Credits: Click to set link';
    statusBarItem.tooltip = 'Click to set your Auggie portal link';
    statusBarItem.show();
    console.log('Status bar item created and shown');

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

    // Register command to reset Usage A
    const resetUsageACommand = vscode.commands.registerCommand('auggieCredits.resetUsageA', async () => {
        const portalLink = context.globalState.get('auggiePortalLink');
        if (!portalLink) {
            vscode.window.showWarningMessage('Please set your Auggie portal link first');
            return;
        }

        try {
            const creditsData = await fetchCredits(portalLink);
            if (creditsData !== null) {
                await context.globalState.update('usageABaseline', creditsData.balance);
                vscode.window.showInformationMessage(`Usage A reset to ${formatNumber(creditsData.balance)} credits`);
                await updateCredits();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to reset Usage A: ${error.message}`);
        }
    });

    // Register command to reset Usage B
    const resetUsageBCommand = vscode.commands.registerCommand('auggieCredits.resetUsageB', async () => {
        const portalLink = context.globalState.get('auggiePortalLink');
        if (!portalLink) {
            vscode.window.showWarningMessage('Please set your Auggie portal link first');
            return;
        }

        try {
            const creditsData = await fetchCredits(portalLink);
            if (creditsData !== null) {
                await context.globalState.update('usageBBaseline', creditsData.balance);
                vscode.window.showInformationMessage(`Usage B reset to ${formatNumber(creditsData.balance)} credits`);
                await updateCredits();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to reset Usage B: ${error.message}`);
        }
    });

    context.subscriptions.push(setLinkCommand);
    context.subscriptions.push(resetUsageACommand);
    context.subscriptions.push(resetUsageBCommand);
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
        const creditsData = await fetchCredits(portalLink);

        if (creditsData !== null) {
            const credits = creditsData.balance;
            const formattedCredits = formatNumber(credits);

            // Get trip odometer values
            const usageA = context.globalState.get('usageABaseline');
            const usageB = context.globalState.get('usageBBaseline');

            // Build status text with trip odometers
            let statusText = `$(credit-card) ${formattedCredits}`;

            if (usageA !== undefined) {
                const usedA = usageA - credits;
                statusText += ` | A: ${usedA >= 0 ? '-' : '+'}${formatNumber(Math.abs(usedA))}`;
            }

            if (usageB !== undefined) {
                const usedB = usageB - credits;
                statusText += ` | B: ${usedB >= 0 ? '-' : '+'}${formatNumber(Math.abs(usedB))}`;
            }

            statusBarItem.text = statusText;

            // Build detailed tooltip
            let tooltip = `Current Auggie credits: ${formattedCredits}\n`;
            tooltip += `Last updated: ${new Date().toLocaleTimeString()}\n`;

            if (usageA !== undefined) {
                const usedA = usageA - credits;
                tooltip += `\nUsage A: ${usedA >= 0 ? '' : '+'}${formatNumber(usedA)} credits since reset`;
            }

            if (usageB !== undefined) {
                const usedB = usageB - credits;
                tooltip += `\nUsage B: ${usedB >= 0 ? '' : '+'}${formatNumber(usedB)} credits since reset`;
            }

            // Add credit blocks info if available
            if (creditsData.creditBlocks && creditsData.creditBlocks.length > 0) {
                tooltip += `\n\nCredit Blocks:`;
                creditsData.creditBlocks.forEach(block => {
                    if (block.balance) {
                        const expiryDate = new Date(block.expiry_date);
                        tooltip += `\n  ${formatNumber(Math.floor(parseFloat(block.balance)))} expires ${expiryDate.toLocaleDateString()}`;
                    }
                });
            }

            // Add reset instructions
            tooltip += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
            tooltip += `\nCommands (Ctrl+Shift+P):`;
            tooltip += `\n  • Reset Usage A Counter`;
            tooltip += `\n  • Reset Usage B Counter`;
            tooltip += `\n  • Set Auggie Portal Link`;

            statusBarItem.tooltip = tooltip;
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

        const customerResponse = await httpsRequest(customerInfoUrl, {
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

        // Use the first pricing unit (or find the one for "Credits")
        let pricingUnitId = pricingUnits[0].id;

        // Try to find "Credits" pricing unit specifically
        const creditsUnit = pricingUnits.find(unit =>
            unit.name === 'credits' ||
            unit.display_name === 'Credits'
        );

        if (creditsUnit) {
            pricingUnitId = creditsUnit.id;
            console.log('✅ Found Credits pricing unit:', creditsUnit);
        } else {
            console.log('⚠️ Credits unit not found, using first unit:', pricingUnits[0]);
        }

        console.log(`🎯 Using Customer ID: ${customerId}, Pricing Unit ID: ${pricingUnitId}`);

        // Step 2: Get ledger summary with the extracted IDs
        const ledgerUrl = `https://portal.withorb.com/api/v1/customers/${customerId}/ledger_summary?pricing_unit_id=${pricingUnitId}&token=${token}`;
        console.log('Fetching ledger summary from:', ledgerUrl);

        const ledgerResponse = await httpsRequest(ledgerUrl, {
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

                // Return credits data with balance and credit blocks
                return {
                    balance: Math.floor(credits),
                    creditBlocks: ledgerData.credit_blocks || []
                };
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
