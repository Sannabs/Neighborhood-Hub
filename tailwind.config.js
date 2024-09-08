/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}

