/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}', // SvelteKit projenizdeki tüm ilgili dosyaları tarayacak
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography, // Typography eklentisini buraya ekledik
    forms,      // Forms eklentisini buraya ekledik
  ],
};