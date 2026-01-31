/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#84cc16',
        'dark-green': '#22c55e',
      },
    },
  },
  plugins: [],
}
