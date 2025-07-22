export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/en' || to.path === '/es') {
        return navigateTo('/');
    }
});
