/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                APP_COLOR: {
                    MAIN_GREEN: "#0898A0",
                    MAIN_GREY_TEXT: '#838282',
                    MAIN_GREY: '#71879C1A',
                    LIGHT_GREY: '#959494',
                    DARK_GREY: '#94A1AD',
                    MAIN_WHITE: '#FFF',
                    ACCENT_GREEN: "#0898A0",
                    MAIN_DARK: '#222222',
                    MAIN_RED: '#962626',
                    MAIN_ORANGE: "#FE7122",
                    MAIN_INDIGO: "#B80074",
                    MAIN_TEAL: "#0898A0",
                    MAIN_TEXT_DARK: "#012224"
                }
            },

            fontFamily: {
                'dmsans-medium': ['DmSans-Medium'],
                'dmsans-regular': ['DmSans-Regular'],
                'dmsans-semibold': ['DmSans-SemiBold'],
                'dmsans-bold': ['DmSans-Bold'],
                'spaceg-medium': ['SPACEG-Medium'],
                'spaceg-regular': ['SPACEG-Regular'],
                'spaceg-semibold': ['SPACEG-SemiBold'],
                'spaceg-bold': ['SPACEG-Bold'],
            },

        },
    },
    plugins: [],
};