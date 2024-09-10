/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'mono': ['Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        'custom': ['Noto Sans Display', 'sans-serif'],
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

