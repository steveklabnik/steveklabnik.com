/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          visited: 'var(--color-accent-visited)',
          light: 'var(--color-accent-light)',
          'light-hover': 'var(--color-accent-light-hover)',
          muted: 'var(--color-accent-muted)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
        },
      },
      textColor: {
        primary: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      },
      borderColor: {
        base: 'var(--color-border)',
      },
      backgroundColor: {
        page: 'var(--color-bg)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            // Better readability with larger font size
            fontSize: '1.125rem', // 18px
            lineHeight: '1.75',
            maxWidth: '65ch',
            // Improved heading styles
            h1: {
              fontSize: '2.25rem',
              lineHeight: '1.2',
              marginBottom: '0.5em',
              fontWeight: '700',
            },
            h2: {
              fontSize: '1.875rem',
              lineHeight: '1.25',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              fontWeight: '600',
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '1.3',
              marginTop: '1.25em',
              marginBottom: '0.5em',
              fontWeight: '600',
            },
            // Better paragraph spacing
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            // Link styles using CSS variables
            a: {
              color: 'var(--color-accent)',
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '2px',
              '&:hover': {
                textDecorationThickness: '2px',
              },
            },
            // Better code blocks
            code: {
              backgroundColor: 'var(--color-surface-alt, #f1f5f9)',
              padding: '0.125em 0.25em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '1em',
              borderRadius: '0.375rem',
              overflowX: 'auto',
            },
            // Better list spacing
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            // Blockquote styling
            blockquote: {
              borderLeftColor: 'var(--color-accent)',
              borderLeftWidth: '4px',
              paddingLeft: '1em',
              fontStyle: 'italic',
              color: 'var(--color-text-secondary)',
            },
          },
        },
      }),
    },
  },
  plugins: [],
};
