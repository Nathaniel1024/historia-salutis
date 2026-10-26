/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vellum: '#F5EFEB',
        walnut: '#1C1613',
        limestone: '#2A2725',
        goldleaf: '#D4AF37',
        lapis: '#1B263B',
        crimson: '#7B1E1E'
      },
      fontFamily: {
        display: ['Cinzel', 'Cormorant Garamond', 'serif'],
        body: ['EB Garamond', 'Plus Jakarta Sans', 'serif']
      },
      boxShadow: {
        manuscript: '0 25px 60px rgba(0,0,0,0.45)'
      }
    }
  },
  plugins: []
};
