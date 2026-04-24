/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Hind', 'Poppins', 'sans-serif'],
        'heading': ['Playfair Display', 'serif'],
        'accent': ['Poppins', 'sans-serif'],
      },
      colors: {
        'cream': {
          '50': '#fdfaf1',
          '100': '#f9f4e2',
          '200': '#f1e6bc',
        }
      }
    },
  },
  plugins: [],
}
