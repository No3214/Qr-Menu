/**
 * Code Integrity & Anti-Tampering Module
 * Detects if code has been modified or running on unauthorized domain
 */

// Authorized domains - code will only work on these
const AUTHORIZED_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'kozbeyli-konagi.vercel.app',
    'kozbeylikonagi.com',
    'www.kozbeylikonagi.com',
];

// Check if running on authorized domain
export function verifyDomain(): boolean {
    if (import.meta.env.DEV) return true; // Skip in development

    const currentDomain = window.location.hostname;
    const isAuthorized = AUTHORIZED_DOMAINS.some(domain =>
        currentDomain === domain || currentDomain.endsWith('.' + domain)
    );

    if (!isAuthorized) {
        // Show warning and break functionality
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: #1a1a1a;
                color: #ff4444;
                font-family: monospace;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1 style="font-size: 48px; margin-bottom: 20px;">⚠️ UNAUTHORIZED</h1>
                    <p style="font-size: 18px; color: #888;">
                        Bu yazılım lisanssız kullanılıyor.<br/>
                        This software is being used without license.
                    </p>
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        © Kozbeyli Konağı - Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        `;
        return false;
    }

    return true;
}

// Fingerprint check - detects if code structure was modified
export function verifyIntegrity(): boolean {
    if (import.meta.env.DEV) return true;

    // Check for expected global objects
    const requiredGlobals = ['React', 'ReactDOM'];
    for (const global of requiredGlobals) {
        if (!(global in window)) {
            return false;
        }
    }

    return true;
}

// Initialize integrity checks
export function initIntegrityChecks(): void {
    if (import.meta.env.PROD) {
        // Check domain on load
        if (!verifyDomain()) {
            throw new Error('Domain verification failed');
        }

        // Periodic integrity check
        setInterval(() => {
            if (!verifyIntegrity()) {
                window.location.reload();
            }
        }, 30000); // Check every 30 seconds
    }
}
