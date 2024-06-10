/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      borderColor: {
        borderBlack10: '#1C1C1C1A',
        borderGray: '#E2E2E2',
        borderSecondaryOrange: '#F56900',
        borderGreenDefault: '#217946',
      },
      textColor: {
        textBlack: '#1C1C1C',
        textDarkBlack: '#060606',
        textBlack80: '#1C1C1CCC',
        textBlack40: '#1C1C1C66',
        textGreenPrimary: '#217946',
        textSecondaryOrange: '#F56900',
        textDefault: '#0B0B0B',
        textSecDefault: '#6D6D6D',
      },
      backgroundColor: {
        bgBlack5: '#1C1C1C0D',
        bgLightGreen: '#F9FBFA',
        bgLightGreenHover: '#F3F7F5',
        bgSecondaryOrange: '#F56900',
        bgBlack10: '#1C1C1C1A',
        bgPrimaryGreen: '#289556',
        bgWhite50: '#F3F7F580',
        bgPrimaryGreen: '#217946',
      },
      colors: {
        statusSuccess: '#23D3A4',
        statusInfo: '#5B68FF',
        statusDanger: '#FF895B',
        statusOrange: '#FFA500',
        statusRed: '#EB5757',
      },
      screens: {
        1200: { max: '1200px' },
        900: { max: '900px' },
      },
    },
  },
  plugins: [],
};
