import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';

export const initPinia = () => {
    // Create pinia if it doesn't exist
    if (!window.piniaApp) {
        const pinia = createPinia();
        const app = createApp(App);
        app.use(pinia);
        window.piniaApp = pinia;
        return pinia;
    }

    // Return existing pinia
    return window.piniaApp;
};
