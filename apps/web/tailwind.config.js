/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sand: {
            DEFAULT: '#EAE5DB',
            light: '#F7F5F0',
            dark: '#C5BEB0',
          },
          linen: {
            DEFAULT: '#FAF8F5',
            dark: '#F1EDE4',
          },
          clay: '#9E9385',
          terracotta: '#BC6C58',
          sage: '#8C9A86',
          walnut: '#3D2E26',
          charcoal: '#1F1E1B'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
