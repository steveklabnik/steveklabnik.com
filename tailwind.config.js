/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: (theme) => ({
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
            // Improved link styles (will be overridden by our custom CSS)
            a: {
              color: theme('colors.purple.600'),
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '2px',
              '&:hover': {
                textDecorationThickness: '2px',
              },
            },
            // Better code blocks
            code: {
              backgroundColor: theme('colors.gray.100'),
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
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
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
              borderLeftColor: theme('colors.purple.600'),
              borderLeftWidth: '4px',
              paddingLeft: '1em',
              fontStyle: 'italic',
              color: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
