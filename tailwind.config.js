/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom-9': '1fr repeat(8, 2fr)',
      },
      borderColor: {
        borderBlack10: '#1C1C1C1A',
        borderGray: '#E2E2E2',
        borderSecondaryOrange: '#F56900',
        borderGreenDefault: '#217946',
        borderBlack40: '#1C1C1C66',
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
        textBlackNew: '#272833',
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
        black20: '#1C1C1C33',
      },
      screens: {
        1200: { max: '1200px' },
        900: { max: '900px' },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
