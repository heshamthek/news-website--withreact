/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8', // Custom color for branding
        'secondary': '#F3F4F6', // Light gray for backgrounds
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)', // Card shadow
      }
    },
  },
  plugins: [],
}
