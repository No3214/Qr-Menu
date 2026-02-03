/**
 * Code Protection Module
 * Prevents casual copying of the application
 *
 * Note: These are deterrents, not absolute security measures.
 * Determined attackers can bypass these, but they raise the barrier.
 */

// Disable right-click context menu on production
export function disableContextMenu(): void {
    if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
}

// Disable text selection on protected elements
export function disableTextSelection(): void {
    if (import.meta.env.PROD) {
        const style = document.createElement('style');
        style.textContent = `
            .no-select {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// Detect DevTools opening (basic detection)
export function detectDevTools(): void {
    if (import.meta.env.PROD) {
        const threshold = 160;

        const checkDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                // DevTools likely open - you can log this or take action
                // Don't break the app, just note it
            }
        };

        setInterval(checkDevTools, 1000);
    }
}

// Disable keyboard shortcuts for DevTools
export function disableDevToolsShortcuts(): void {
    if (import.meta.env.PROD) {
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
                e.preventDefault();
                return false;
            }
            // Ctrl+U (view source)
            if (e.ctrlKey && e.key.toUpperCase() === 'U') {
                e.preventDefault();
                return false;
            }
        });
    }
}

// Add invisible watermark to the page
export function addWatermark(): void {
    const watermark = document.createElement('div');
    watermark.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        font-size: 1px;
        color: transparent;
        pointer-events: none;
        z-index: -1;
    `;
    watermark.textContent = '© Kozbeyli Konağı - Tüm hakları saklıdır';
    document.body.appendChild(watermark);
}

// Initialize all protections
export function initProtection(): void {
    disableContextMenu();
    disableTextSelection();
    disableDevToolsShortcuts();
    addWatermark();
}
