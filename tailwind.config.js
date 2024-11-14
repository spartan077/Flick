/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#4B0082',
        'light-blue': '#ADD8E6',
        'vibrant-blue': '#1E90FF',
        'navy-blue': '#000080',
        'bright-orange': '#FFA500',
        'goldenrod': '#DAA520',
      },
    },
  },
  plugins: [],
} 