const baseFontSize = 13;
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [{
        pattern: /hljs+/,
    }],
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': theme('colors.gray[800]'),
                        '--tw-prose-headings': theme('colors.gray[900]'),
                        '--tw-prose-lead': theme('colors.gray[700]'),
                        '--tw-prose-links': theme('colors.gray[900]'),
                        '--tw-prose-bold': theme('colors.gray[900]'),
                        '--tw-prose-counters': theme('colors.gray[600]'),
                        '--tw-prose-bullets': theme('colors.gray[400]'),
                        '--tw-prose-hr': theme('colors.gray[300]'),
                        '--tw-prose-quotes': theme('colors.gray[900]'),
                        '--tw-prose-quote-borders': theme('colors.gray[300]'),
                        '--tw-prose-captions': theme('colors.gray[700]'),
                        '--tw-prose-code': theme('colors.gray[900]'),
                        '--tw-prose-pre-code': theme('colors.gray[100]'),
                        '--tw-prose-pre-bg': theme('colors.gray[900]'),
                        '--tw-prose-th-borders': theme('colors.gray[300]'),
                        '--tw-prose-td-borders': theme('colors.gray[200]'),
                        '--tw-prose-invert-body': theme('colors.gray[200]'),
                        '--tw-prose-invert-headings': theme('colors.white'),
                        '--tw-prose-invert-lead': theme('colors.gray[300]'),
                        '--tw-prose-invert-links': theme('colors.white'),
                        '--tw-prose-invert-bold': theme('colors.white'),
                        '--tw-prose-invert-counters': theme('colors.gray[400]'),
                        '--tw-prose-invert-bullets': theme('colors.gray[600]'),
                        '--tw-prose-invert-hr': theme('colors.gray[700]'),
                        '--tw-prose-invert-quotes': theme('colors.gray[100]'),
                        '--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
                        '--tw-prose-invert-captions': theme('colors.gray[400]'),
                        '--tw-prose-invert-code': theme('colors.white'),
                        '--tw-prose-invert-pre-code': theme('colors.gray[300]'),
                        '--tw-prose-invert-pre-bg': '#1C1D21',
                        '--tw-prose-invert-th-borders': theme('colors.gray[600]'),
                        '--tw-prose-invert-td-borders': theme('colors.gray[700]'),
                    },
                },
            }),
            spacing: () => ({
                ...Array.from({ length: 96 }, (_, index) => index * 0.5)
                    .filter((i) => i)
                    .reduce(
                        (acc, i) => ({ ...acc, [i]: `${i / (baseFontSize / 4)}rem` }),
                        {}
                    ),
            }),
            fontSize: {
                xs: [
                    `${(16 * 0.75) / baseFontSize}rem`, /* 12px */
                    {
                        lineHeight: `${(16 * 1) / baseFontSize}rem` /* 16px */,
                    },
                ],
                sm: [
                    `${(16 * 0.875) / baseFontSize}rem`, /* 14px */
                    {
                        lineHeight: `${(16 * 1.25) / baseFontSize}rem` /* 20px */,
                    },
                ],
                base: [
                    `${(16 * 1) / baseFontSize}rem`, /* 16px */
                    {
                        lineHeight: `${(16 * 1.5) / baseFontSize}rem` /* 24px */,
                    },
                ],
                lg: [
                    `${(16 * 1.125) / baseFontSize}rem`, /* 18px */
                    {
                        lineHeight: `${(16 * 1.75) / baseFontSize}rem` /* 28px */,
                    },
                ],
                xl: [
                    `${(16 * 1.25) / baseFontSize}rem`, /* 20px */
                    {
                        lineHeight: `${(16 * 1.75) / baseFontSize}rem` /* 28px */,
                    },
                ],
                "2xl": [
                    `${(16 * 1.5) / baseFontSize}rem`, /* 24px */
                    {
                        ineHeight: `${(16 * 2) / baseFontSize}rem` /* 32px */,
                    },
                ],
                "3xl": [
                    `${(16 * 1.875) / baseFontSize}rem`, /* 30px */
                    {
                        lineHeight: `${(16 * 2.25) / baseFontSize}rem` /* 36px */,
                    },
                ],
                "4xl": [
                    `${(16 * 2.25) / baseFontSize}rem`, /* 36px */
                    {
                        lineHeight: `${(16 * 2.5) / baseFontSize}rem` /* 40px */,
                    },
                ],
                "5xl": [
                    `${(16 * 3) / baseFontSize}rem`, /* 48px */
                    {
                        lineHeight: (16 * 1) / baseFontSize,
                    },
                ],
                "6xl": [
                    `${(16 * 3.75) / baseFontSize}rem`, /* 60px */
                    {
                        lineHeight: (16 * 1) / baseFontSize,
                    },
                ],
                "7xl": [
                    `${(16 * 4.5) / baseFontSize}rem`, /* 72px */
                    {
                        lineHeight: (16 * 1) / baseFontSize,
                    },
                ],
                "8xl": [
                    `${(16 * 6) / baseFontSize}rem`, /* 96px */
                    {
                        lineHeight: (16 * 1) / baseFontSize,
                    },
                ],
                "9xl": [
                    `${(16 * 8) / baseFontSize}rem`, /* 128px */
                    {
                        lineHeight: (16 * 1) / baseFontSize,
                    },
                ],
            },
        },
        hljs: {
            theme: 'an-old-hope',
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('tailwind-highlightjs')
    ],
}
