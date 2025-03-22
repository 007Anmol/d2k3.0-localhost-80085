// tailwind.config.js
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
          },
          secondary: {
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
          },
          neon: {
            pink: '#FF61EF',
            green: '#39FF14',
          },
        },
      },
    },
    plugins: [],
  };