/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      gridTemplateColumns: {
        'custom-9': '1fr repeat(8, 2fr)',
        24: 'repeat(24, minmax(0, 1fr))',
        34: 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-19': 'span 19 / span 19',
        'span-24': 'span 19 / span 19',
      },
      colors: {
        // Shadcn UI colors (using CSS variables)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Custom GreenTeam colors
        statusSuccess: '#23D3A4',
        statusInfo: '#5B68FF',
        statusDanger: '#FF895B',
        statusOrange: '#FFA500',
        statusRed: '#EB5757',
        black20: '#1C1C1C33',
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
        bgPrimaryGreen: '#217946',
        bgWhite50: '#F3F7F580',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      screens: {
        1200: { max: '1200px' },
        900: { max: '900px' },
        'lg-custom': { max: '1440px' },
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
  plugins: [require('tailwindcss-animate')],
};
