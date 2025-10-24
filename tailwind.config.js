/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-patrick-hand)', 'cursive'],
        urbanist: ['var(--font-patrick-hand)', 'cursive'],
        montserrat: ['var(--font-patrick-hand)', 'cursive'],
        'patrick-hand': ['var(--font-patrick-hand)', 'cursive'],
      },
    },
  },
  plugins: [],
}
