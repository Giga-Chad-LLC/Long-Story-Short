import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input|chip|popover|modal|select).js"
    ],
    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {},
        },
        extend: {
            colors: {
                darkblue: "var(--darkblue)",
            }
        },
    },
    darkMode: "class",
    plugins: [nextui()],
}

