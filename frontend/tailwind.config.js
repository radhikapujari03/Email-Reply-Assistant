/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          main: '#0B1220',
          card: '#152238',
          secondary: '#1B2C45',
          border: '#263B58',
          hover: '#1F3452',
        },
        accent: {
          cyan: '#16BFD0',
          blue: '#6FA8FF',
          violet: '#A78BFA',
        },
        content: {
          primary: '#F1F7FF',
          secondary: '#A9B8CC',
          muted: '#6C7E99',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(22, 191, 208, 0.25)',
        'glow-cyan-lg': '0 0 40px -5px rgba(22, 191, 208, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(111, 168, 255, 0.25)',
        'glow-violet': '0 0 25px -5px rgba(167, 139, 250, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
