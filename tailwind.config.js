/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./dashboard/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
            },
            colors: {
                // Blueprint Colors
                bg: "#F7F7F9",
                surface: "#FFFFFF",
                text: {
                    DEFAULT: "#111827",
                    muted: "#6B7280"
                },
                border: "#E5E7EB",
                primary: {
                    DEFAULT: "#C5A059", // Kozbeyli Gold
                    hover: "#B08D22",
                    foreground: "#FFFFFF"
                },
                // Gold palette (QRCodeEditor & design system)
                gold: {
                    100: '#FDF5E1',
                    200: '#F5E6B8',
                    300: '#E8D08A',
                    400: '#D4AF37',
                    500: '#C5A059',
                    600: '#B08D22',
                },
                success: "#16A34A",
                warning: "#F59E0B",
                danger: "#EF4444",
                chip: {
                    bg: "#F3F4F6"
                }
            },
            borderRadius: {
                'lg': '16px',
                'xl': '20px',
                '2xl': '24px',
            },
            boxShadow: {
                'card': '0 1px 2px rgba(0,0,0,0.06)',
                'modal': '0 10px 30px rgba(0,0,0,0.18)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'in': 'animateIn 0.3s ease-out forwards',
                'enter': 'animateIn 0.2s ease-out forwards',
                'leave': 'animateOut 0.15s ease-in forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                animateIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
                    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
                animateOut: {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.95)' },
                },
            },
        },
    },
    plugins: [],
}
