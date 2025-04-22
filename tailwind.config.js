/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ecoPink: '#F7CAC9',
        userBlue: '#5B9BD5',
      },
    },
  },
  plugins: [],
};
