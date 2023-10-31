/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#7761FF',
        neutrals: {
          'white-100': '#FFFFFF',
          black: '#111111',
          'black-20': 'rgba(0, 0, 0, 0.2)',
        },
        gray: {
          'gray-ddd': '#DDDDDD',
          'gray-bbb': '#BBBBBB',
          'gray-777': '#777777',
          'gray-444': '#444444',
        },
      },
      fontSize: {
        'ttl-xl': '6rem',
        'ttl-l': '3.2rem',
        'ttl-m': '2.4rem',
        'ttl-s': '2rem',
        'fz-xl': '1.8rem',
        'fz-l': '1.6rem',
        'fz-m': '1.4rem',
        'fz-s': '1.3rem',
      },
    },
  },
  plugins: [],
};
