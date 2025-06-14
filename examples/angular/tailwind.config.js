const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': 'var(--fa-dark-green)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'primary-text': 'var(--color-primary-text)',
        'secondary-text': 'var(--color-secondary-text)',
        accent: 'var(--color-accent)',
        'border-dark': 'var(--color-border-dark)',
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        brand: ['Manrope', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        bordered: 'var(--fa-shadow-bordered)',
      },
    },
  },
  plugins: [],
};
