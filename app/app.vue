<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup></script>

<style>
:root {
    --transition-speed: 0.2s;
    --transition-distance: 10px;
}

/* Transiciones de página - hacia adelante */
.page-enter-active,
.page-leave-active {
    transition: all var(--transition-speed) ease;
}

.page-enter-from {
    opacity: 0;
    transform: translateX(var(--transition-distance));
}

.page-leave-to {
    opacity: 0;
    transform: translateX(calc(-1 * var(--transition-distance)));
}

/* Transiciones de página - hacia atrás */
.page-back-enter-active,
.page-back-leave-active {
    transition: all var(--transition-speed) ease;
}

.page-back-enter-from {
    opacity: 0;
    transform: translateX(calc(-1 * var(--transition-distance)));
}

.page-back-leave-to {
    opacity: 0;
    transform: translateX(var(--transition-distance));
}

/* Transiciones de layout */
.layout-enter-active,
.layout-leave-active {
    transition: all var(--transition-speed) ease;
}

.layout-enter-from {
    opacity: 0;
    transform: scale(0.95);
}

.layout-leave-to {
    opacity: 0;
    transform: scale(1.05);
}
</style>
