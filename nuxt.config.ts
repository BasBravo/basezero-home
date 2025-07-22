// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: false },
    modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/i18n'],
    alias: {
        '~~/shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
    app: {
        pageTransition: false,
        layoutTransition: false,
        head: {
            link: [
                {
                    rel: 'preconnect',
                    href: 'https://fonts.googleapis.com',
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: '',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
                },
            ],
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1.0, user-scalable=no',
                },
            ],
        },
    },
    css: ['~/assets/css/main.css', '~/assets/css/fonts.css', '~/assets/css/maps/index.css', '~/assets/css/transitions.css'],
    ssr: false,
    // i18n: {
    //     strategy: 'prefix',
    //     defaultLocale: 'en',
    //     langDir: 'locales',
    //     detectBrowserLanguage: {
    //         alwaysRedirect: true,
    //     },
    //     locales: [
    //         {
    //             code: 'en',
    //             file: 'en.js',
    //         },
    //         {
    //             code: 'es',
    //             file: 'es.js',
    //         },
    //     ],
    //     compilation: {
    //         strictMessage: false,
    //     },
    // },
    runtimeConfig: {
        public: {
            storageUrl: process.env.NUXT_STORAGE_URL,
            functionsUrl: process.env.NUXT_FUNCTIONS_URL,
            authUrl: process.env.NUXT_AUTH_URL,
            hostUrl: process.env.NUXT_APP_URL,
            connectProvider: process.env.NUXT_PROVIDER_DATA,
            connectConfig: {
                appName: process.env.NUXT_APP_NAME,
                apiKey: process.env.NUXT_APP_KEY,
                authDomain: process.env.NUXT_AUTH_DOMAIN,
                projectId: process.env.NUXT_PROJECT_ID,
                storageBucket: process.env.NUXT_STORAGE_BUCKET,
                messagingSenderId: process.env.NUXT_MESSAGING_SENDER_ID,
                appId: process.env.NUXT_APP_ID,
                measurementId: process.env.NUXT_MEASUREMENT_ID,
            },
            algolia: {},
            stripe: {
                publicKey: process.env.NUXT_STRIPE_PUBLIC_KEY,
                secretKey: process.env.NUXT_STRIPE_SECRET_KEY,
            },
            mapbox: {
                apiKey: process.env.NUXT_MAPBOX_API_KEY,
            },
            gtagId: process.env.NUXT_GOOGLE_GTAG_ID,
            cryptoKey: process.env.NUXT_CRYPTO_KEY,
        },
    },
    vite: {
        server: {
            fs: {
                strict: false,
            },
        },
    },
    postcss: {
        plugins: {
            '@tailwindcss/postcss': {},
            autoprefixer: {},
        },
    },
    nitro: {
        preset: 'firebase',
        firebase: { nodeVersion: '20', gen: 2, httpsOptions: { region: 'europe-west3', maxInstances: 3 } },
        replace: {
            [`as server } from './chunks/`]: `as server_basezero } from './chunks/`,
            [`functions.https.onRequest`]: `functions.region('europe-west3').https.onRequest`,
        },
    },
});
