const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Mêmes couleurs que src/constants/theme.ts — utiliser avec dark: (ex. bg-element dark:bg-element-dark)
      colors: {
        element: { DEFAULT: '#F0F0F3', dark: '#212225' },
        selected: { DEFAULT: '#E0E1E6', dark: '#2E3135' },
        secondary: { DEFAULT: '#60646C', dark: '#B0B4BA' },
      },
      fontFamily: {
        mono: platformSelect({
          ios: 'ui-monospace',
          android: 'monospace',
          default: 'var(--font-mono)',
        }),
      },
    },
  },
  plugins: [],
};
