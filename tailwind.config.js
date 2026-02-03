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
                    DEFAULT: "#008FAC", // "Modern Fisherman Blue" (Deep Cyan/Teal)
                    hover: "#007A94",
                    foreground: "#FFFFFF"
                },
                accent: "#C5A059", // Gold accent color
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
                'premium-fade': 'premiumFade 0.6s ease-out forwards',
                'scale-up': 'scaleUp 0.3s ease-out forwards',
                'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
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
                premiumFade: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleUp: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                bounceIn: {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
