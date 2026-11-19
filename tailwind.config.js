/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        dark: {
          950: '#060913', // Deep Obsidian Navy (Night Mode Main Background)
          900: '#0E1526', // Elevated Card & Container Surface
          850: '#141E33',
          800: '#1E293B', // Border Color
          750: '#283548',
          700: '#334155', // Slate 700
          600: '#475569', // Slate 600
        },
        executive: {
          night: '#060913',
          card: '#0E1526',
          border: '#1E293B',
          accent: '#2563EB',
          accentHover: '#3B82F6',
          highlight: '#10B981',
          heading: '#F8FAFC',
          body: '#94A3B8',
          // Boardroom Clarity (Light Mode)
          lightBg: '#F8FAFC',
          lightCard: '#FFFFFF',
          lightBorder: '#E2E8F0',
          lightAccent: '#1D4ED8',
          lightHighlight: '#059669',
          lightHeading: '#0F172A',
          lightBody: '#475569',
        },
        cyan: {
          400: '#38bdf8', // Soft sky blue
          500: '#0ea5e9',
          accent: '#0284c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        arabic: ['Cairo', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }
    },
  },
  plugins: [],
}
