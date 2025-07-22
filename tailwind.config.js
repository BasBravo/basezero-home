// tailwind.config.js
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue"
    ],
    theme: {
        extend: {
            boxShadow: {
                '3xl': '0 20px 56px 0 rgba(0,0,0,0.30)',
            },
        },
    },
}