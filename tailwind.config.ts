import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Kaya Hub Typography System
        serif: ['Crimson Text', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // Keep existing for backward compatibility
        body: ['Inter', 'sans-serif'],
        headline: ['Nunito', 'serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Kaya Hub Color Palette
        // Winter Colors (Dormancy Phase)
        'winter-bark': '#4c4134',
        'frozen-earth': '#3e3529',
        'dead-leaves': '#5a4d3c',
        'winter-stone': '#434a3a',
        
        // Spring Colors (Emergence Phase)
        'new-shoots': '#6a8c5a',
        'spring-moss': '#7a9973',
        'fresh-growth': '#8ab083',
        'morning-dew': '#9bc49b',
        
        // Transition Colors (Thaw Phase)
        'thaw-brown': '#57664a',
        'wet-earth': '#574d3f',
        'early-growth': '#6b7a5f',
        
        // Text Colors
        'text-winter': '#a8a089',
        'text-spring': 'rgba(152, 184, 156, 0.9)',
        'text-winter-secondary': 'rgba(168, 151, 115, 0.8)',
        'text-spring-secondary': 'rgba(152, 184, 156, 0.8)',
        'text-winter-headline': '#a89573',
        'text-spring-headline': '#98b89c',
        'text-muted': 'rgba(168, 160, 137, 0.6)',
        
        // Existing system colors (keep for compatibility)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        // Kaya Hub Border Radius System
        'kaya-sm': '2px',
        'kaya-md': '3px',
        'kaya-lg': '6px',
        // Existing system (keep for compatibility)
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        // Kaya Hub Spacing System
        'kaya-xs': '4px',
        'kaya-sm': '8px',
        'kaya-md': '12px',
        'kaya-lg': '20px',
        'kaya-xl': '30px',
        'kaya-xxl': '50px',
      },
      keyframes: {
        // Kaya Hub Animations
        'spring-awakening': {
          '0%': { opacity: '0.3', filter: 'hue-rotate(0deg)' },
          '25%': { opacity: '0.5', filter: 'hue-rotate(15deg)' },
          '50%': { opacity: '0.7', filter: 'hue-rotate(30deg)' },
          '75%': { opacity: '0.6', filter: 'hue-rotate(20deg)' },
          '100%': { opacity: '0.3', filter: 'hue-rotate(0deg)' },
        },
        'spring-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        'seasonal-progress': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'seasonal-text': {
          '0%, 100%': { filter: 'brightness(0.8) saturate(0.9)' },
          '50%': { filter: 'brightness(1.2) saturate(1.3)' },
        },
        'growth-line': {
          '0%, 100%': { width: '40%', opacity: '0.4' },
          '50%': { width: '80%', opacity: '0.8' },
        },
        'shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        // Existing animations (keep for compatibility)
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        // Kaya Hub Animations
        'spring-awakening': 'spring-awakening 25s ease-in-out infinite',
        'spring-glow': 'spring-glow 8s ease-in-out infinite',
        'seasonal-progress': 'seasonal-progress 12s linear infinite',
        'seasonal-text': 'seasonal-text 6s ease-in-out infinite',
        'growth-line': 'growth-line 4s ease-in-out infinite',
        'shimmer': 'shimmer 0.6s ease',
        // Existing animations (keep for compatibility)
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
