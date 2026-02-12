/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Style Colors
        primary: '#003366', // Deep government blue
        secondary: '#004B87', // Professional blue
        accent: '#C5192D', // Official red accent
        'gov-light': '#F5F7FA', // Light government background
        'gov-border': '#D3D8DE', // Professional border
        'gov-text': '#1A1A1A', // Dark text
        'gov-text-light': '#666666', // Medium text
        textSmall: '#858D9D',
        textMedium: '#383E49',
      },
      fontFamily: {
        'sans': ['Urbanist', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
      boxShadow: {
        'gov': '0 2px 8px rgba(0, 51, 102, 0.1)',
        'gov-lg': '0 4px 16px rgba(0, 51, 102, 0.15)',
      },
      borderRadius: {
        'gov': '4px',
      }
    },
  },
  plugins: [],
}