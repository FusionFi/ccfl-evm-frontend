import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        primary: ['Segoe UI'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        xxs: '420px',
        xs: '576px',
        sm: '640px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      fontSize: {
        '4.5xl': ['2.375rem', '2.5rem'],
      },
      colors: {
        primary: '#6559F5',
        'blue-5': '#847AF7',

        'gray-2': '#FAFAFA',
        'gray-3': '#F5F5F5',
        'gray-5': '#D9D9D9',
        'gray-6': '#BFBFBF',
        'gray-8': '#595959',
        'gray-9': '#262626',

        'red-6': '#F5222D',

        'orange-6': '#FA8C16',
        'bg-primary': 'linear-gradient(90deg, #7D4899 0%, #5498CD 100%)',
      },
      inset: {
        '-40px': '-40px',
      },
    },
  },
  plugins: [],
};
export default config;
