/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './packages/react-ui/src/**/*.{js,jsx,ts,tsx}',
    './packages/react-ui/*.html',
    './packages/landing/src/**/*.{html,css}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      // Default font stack now uses Montserrat
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      body: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      // Additional available fonts
      michroma: ['Michroma', 'sans-serif'],
      arimo: ['Arimo', 'sans-serif'],
    },
    /**
     * Custom breakpoints for more granular responsive design
     * - mdPlus: between md (768px) and lg (1024px)
     * - lgPlus: between lg (1024px) and xl (1280px)
     * - xlPlus: between xl (1280px) and 2xl (1536px)
     */
    screens: {
      sm: '640px',
      md: '768px',
      mdPlus: '900px', // Between md and lg
      lg: '1024px',
      lgPlus: '1152px', // Between lg and xl
      xl: '1280px',
      xlPlus: '1400px', // Between xl and 2xl
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Ice Cream Sneaker-inspired color palette
        'aviator-background': '#fcf2d4', // Clean white background
        'aviator-black': '#121212',
        'da-pink': {
          50: '#fef1f7', // Very light pink
          100: '#fce7f3', // Light pink
          200: '#fbcfe8', // Soft pink
          300: '#f8a5d4', // Medium light pink
          400: '#f472b6', // Medium pink
          500: '#ec4899', // Bright pink (main sneaker pink)
          600: '#db2777', // Deeper pink
          700: '#be185d', // Dark pink
          800: '#9d174d', // Very dark pink
          900: '#831843', // Darkest pink
        },
        'da-green': {
          50: '#f0fdf4', // Very light green
          100: '#dcfce7', // Light green
          200: '#bbf7d0', // Soft green
          300: '#86efac', // Medium light green
          400: '#4ade80', // Medium green
          500: '#22c55e', // Bright green (main sneaker green)
          600: '#16a34a', // Deeper green
          700: '#15803d', // Dark green
          800: '#166534', // Very dark green
          900: '#14532d', // Darkest green
        },
        'da-yellow': {
          50: '#fefce8', // Very light yellow
          100: '#fef3c7', // Light yellow
          200: '#fde68a', // Soft yellow
          300: '#fcd34d', // Medium light yellow
          400: '#fbbf24', // Medium yellow
          500: '#f59e0b', // Bright yellow (main sneaker yellow)
          600: '#d97706', // Deeper yellow
          700: '#b45309', // Dark yellow
          800: '#92400e', // Very dark yellow
          900: '#78350f', // Darkest yellow
        },
      },
      boxShadow: {
        'inset-2xs': 'inset 0 1px 2px 0 rgba(0,0,0,0.05)', // Subtle inner shadow
        'inset-neutral-600': 'inset 0 2px 4px 0 rgba(82,82,82,0.5)', // Neutral inner shadow
        'inset-neutral-800': 'inset 0 2px 8px 0 rgba(38,38,38,0.7)', // Darker inner shadow for active
      },
      backgroundImage: {
        'linear-to-b':
          'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
      },
    },
  },
  plugins: [],
};
