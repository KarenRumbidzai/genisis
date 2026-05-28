/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fertility Palette - Warm, nurturing colors
        terracotta: {
          50: '#FDF6F1',
          100: '#FAE8D8',
          200: '#F5D0B1',
          300: '#EEB589',
          400: '#E09661',
          500: '#C4622D', // Primary terracotta
          600: '#A85226',
          700: '#8C431F',
          800: '#703418',
          900: '#542511',
        },
        plum: {
          50: '#FAF5FB',
          100: '#F2E6F5',
          200: '#E5CCEB',
          300: '#D1A8DB',
          400: '#B87EC6',
          500: '#7B3F8C', // Primary plum
          600: '#693578',
          700: '#572B64',
          800: '#452250',
          900: '#33183C',
        },
        forest: {
          50: '#F0F7F4',
          100: '#D9EDE4',
          200: '#B3DBC9',
          300: '#8DC9AE',
          400: '#67B793',
          500: '#2D6A4F', // Primary forest green
          600: '#265A43',
          700: '#1F4A37',
          800: '#183A2B',
          900: '#112A1F',
        },
        rust: {
          50: '#FDF3EF',
          100: '#F9DCD3',
          200: '#F3B9A7',
          300: '#ED967B',
          400: '#E7734F',
          500: '#B5451B', // Primary deep rust
          600: '#9A3B17',
          700: '#7F3113',
          800: '#64270F',
          900: '#491D0B',
        },
        cream: {
          50: '#FFFBF7',
          100: '#FFF5ED',
          200: '#FFEBE0',
          300: '#FFE0D4',
          400: '#FFD6C7',
          500: '#FFCCBB',
        },
        sage: {
          50: '#F6F8F6',
          100: '#E8EDE8',
          200: '#D1DBD1',
          300: '#BAC9BA',
          400: '#A3B7A3',
          500: '#8CA58C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(196, 98, 45, 0.15)',
        'soft-lg': '0 10px 40px -4px rgba(196, 98, 45, 0.2)',
        'glow': '0 0 40px -10px rgba(196, 98, 45, 0.3)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FDF6F1 0%, #FAF5FB 50%, #F0F7F4 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFFBF7 0%, #FDF6F1 50%, #FAF5FB 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(253,246,241,0.8) 100%)',
      }
    },
  },
  plugins: [],
}
