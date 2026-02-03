/**
 * QRService - QR kod oluşturma ve yönetimi
 */

export interface QRCodeConfig {
    id: string;
    name: string;
    type: 'menu' | 'table' | 'wifi' | 'event' | 'custom';
    url: string;
    tableNumber?: number;
    locationId?: string;
    createdAt: Date;
    scans: number;
    isActive: boolean;
}

export interface WifiConfig {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
}

// QR Code generation using QRCode.js library format
// For actual implementation, use: npm install qrcode

export const QRService = {
    /**
     * Generate QR code data URL
     * Uses a simple approach - in production use qrcode library
     */
    generateQRDataUrl: async (data: string, size: number = 256): Promise<string> => {
        // Use QR Code API for generation (free, no API key needed)
        const encodedData = encodeURIComponent(data);
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&format=svg`;
    },

    /**
     * Generate menu QR code
     */
    generateMenuQR: async (restaurantSlug: string, options?: { tableNumber?: number; locationId?: string }): Promise<string> => {
        let url = `${window.location.origin}/${restaurantSlug}`;

        const params = new URLSearchParams();
        if (options?.tableNumber) params.set('table', String(options.tableNumber));
        if (options?.locationId) params.set('location', options.locationId);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        return QRService.generateQRDataUrl(url);
    },

    /**
     * Generate Wi-Fi QR code
     * Format: WIFI:T:WPA;S:SSID;P:password;H:hidden;;
     */
    generateWifiQR: async (config: WifiConfig): Promise<string> => {
        const wifiString = `WIFI:T:${config.encryption};S:${config.ssid};P:${config.password};H:${config.hidden ? 'true' : 'false'};;`;
        return QRService.generateQRDataUrl(wifiString);
    },

    /**
     * Generate table-specific QR codes in bulk
     */
    generateTableQRs: async (restaurantSlug: string, tableCount: number): Promise<{ tableNumber: number; qrUrl: string }[]> => {
        const results: { tableNumber: number; qrUrl: string }[] = [];

        for (let i = 1; i <= tableCount; i++) {
            const qrUrl = await QRService.generateMenuQR(restaurantSlug, { tableNumber: i });
            results.push({ tableNumber: i, qrUrl });
        }

        return results;
    },

    /**
     * Get saved QR configurations (mock data)
     */
    getQRConfigs: async (): Promise<QRCodeConfig[]> => {
        // In production, fetch from database
        return [
            {
                id: 'qr-1',
                name: 'Ana Menü QR',
                type: 'menu',
                url: window.location.origin,
                createdAt: new Date('2024-01-15'),
                scans: 1250,
                isActive: true
            },
            {
                id: 'qr-2',
                name: 'Masa 1',
                type: 'table',
                url: `${window.location.origin}?table=1`,
                tableNumber: 1,
                createdAt: new Date('2024-01-15'),
                scans: 89,
                isActive: true
            },
            {
                id: 'qr-3',
                name: 'Masa 2',
                type: 'table',
                url: `${window.location.origin}?table=2`,
                tableNumber: 2,
                createdAt: new Date('2024-01-15'),
                scans: 76,
                isActive: true
            },
            {
                id: 'qr-wifi',
                name: 'Misafir Wi-Fi',
                type: 'wifi',
                url: 'WIFI:T:WPA;S:Kozbeyli-Guest;P:welcome2024;;',
                createdAt: new Date('2024-01-10'),
                scans: 432,
                isActive: true
            }
        ];
    },

    /**
     * Track QR code scan
     */
    trackScan: async (qrId: string, metadata?: Record<string, string>): Promise<void> => {
        // In production, save to analytics database
        console.log('QR Scan tracked:', qrId, metadata);
    },

    /**
     * Download QR code as image
     */
    downloadQR: async (qrUrl: string, filename: string = 'qr-code'): Promise<void> => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download QR code:', error);
        }
    },

    /**
     * Print QR codes (opens print dialog)
     */
    printQRs: (qrUrls: string[], titles: string[]): void => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>QR Kodları Yazdır</title>
                <style>
                    body { font-family: system-ui, sans-serif; }
                    .qr-item {
                        display: inline-block;
                        text-align: center;
                        margin: 20px;
                        page-break-inside: avoid;
                    }
                    .qr-item img { width: 200px; height: 200px; }
                    .qr-item h3 { margin: 10px 0 0; font-size: 14px; }
                    @media print {
                        .qr-item { margin: 10mm; }
                    }
                </style>
            </head>
            <body>
                ${qrUrls.map((url, i) => `
                    <div class="qr-item">
                        <img src="${url}" alt="QR Code" />
                        <h3>${titles[i] || `QR #${i + 1}`}</h3>
                    </div>
                `).join('')}
                <script>window.onload = () => window.print();</script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    }
};

export default QRService;
