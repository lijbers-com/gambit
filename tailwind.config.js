/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cream palette — Gambit / Edge brand neutral scale.
        // Referenced by --neutral-* in :root. Kept here for direct use when needed.
        cream: {
          50:  '#fffdf5',
          100: '#fff9eb',
          200: '#f5f2ec',
          300: '#e8e4dd',
          400: '#d5d0c8',
          500: '#bbb6af',
          600: '#9b9690',
          700: '#7c7874',
          800: '#615e5b',
          900: '#4d4b48',
          950: '#252422',
        },
        // Neutral scale — mirrors CSS --neutral-* variables.
        // Change the CSS vars in globals.css to retheme all neutral surfaces at once.
        neutral: {
          50:  'rgb(var(--neutral-50))',
          100: 'rgb(var(--neutral-100))',
          200: 'rgb(var(--neutral-200))',
          300: 'rgb(var(--neutral-300))',
          400: 'rgb(var(--neutral-400))',
          500: 'rgb(var(--neutral-500))',
          600: 'rgb(var(--neutral-600))',
          700: 'rgb(var(--neutral-700))',
          800: 'rgb(var(--neutral-800))',
          900: 'rgb(var(--neutral-900))',
        },
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}