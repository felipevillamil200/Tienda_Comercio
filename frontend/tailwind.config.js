/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#070707',
          900: '#0d0d0d',
          850: '#121212',
          800: '#181818',
          700: '#262626',
          600: '#3f3f46',
          400: '#a1a1aa',
          200: '#e4e4e7',
          50: '#fafafa'
        },
        heat: {
          500: '#ff4d00',
          600: '#e03e00',
          glow: 'rgba(255, 77, 0, 0.15)'
        },
        wompi: {
          blue: '#142850',
          yellow: '#f4b41a',
        }
      },
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      }
    },
  },
  plugins: [],
};
