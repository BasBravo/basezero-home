<script setup>
// Composables para sanitización segura
import { useMapStore } from '~~/stores/mapStore';
import { projects } from '~~/data/projects';
import { footerLinks } from '~~/data/nav';

// Store para manejar la localización seleccionada
const mapStore = useMapStore();

useHead({
    title: 'basezero projects',
    meta: [
        {
            name: 'description',
            content:
                'A space to share and learn by creating software and digital products, without rules or much planning. Here ideas take shape from zero.',
        },
    ],
});

// Función para manejar la selección de localización
const thisYear = new Date().getFullYear();
</script>

<template>
    <div class="w-full min-h-[100dvh] flex flex-col items-center justify-center">
        <Logo class="flex z-10 w-full min-h-20 max-w-[250px] lg:max-w-[350px]" type="logo" color="black" />
        <div class="flex flex-col max-w-2xl text-black/50 mt-6 items-center text-sm lg:text-base">
            <!-- Logo y título principal -->
            <h1 class="max-w-xl text-center text-balance mb-2">
                A space to share and learn by creating software and digital products, without rules or much planning. Here ideas take shape
                from zero.
            </h1>

            <div class="mt-4 flex gap-2 justify-center">
                <span>Development</span>
                <span>·</span>
                <span>Creativity</span>
                <span>·</span>
                <span>Social</span>
            </div>
        </div>
        <!-- Grid de proyectos -->
        <div class="max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-10 mx-auto w-fit p-10 mt-10">
            <template v-for="project in projects" :key="project.id">
                <!-- Proyecto normal -->
                <a
                    v-if="project.status !== 'coming-soon'"
                    :href="project.url"
                    target="_blank"
                    class="flex flex-col items-center hover:opacity-80 transition-opacity">
                    <img :src="project.logo" :alt="`${project.name} logo`" class="h-12" />
                    <p class="mt-3 text-sm font-medium text-black">{{ project.name }}</p>
                    <p class="mt-1 text-xs w-full text-center text-black/50">{{ project.description }}</p>
                </a>

                <!-- Próximamente -->
                <div v-else class="flex flex-col items-center">
                    <div class="size-11 bg-white rounded-2xl flex items-center justify-center">
                        <span class="text-lg font-medium text-black/30">?</span>
                    </div>
                    <p class="mt-3 text-sm font-medium text-black/40">{{ project.description }}</p>
                    <p class="mt-1 text-xs w-full text-center text-black/40">Coming soon</p>
                </div>
            </template>
        </div>
    </div>
    <div class="fixed inset-0 w-full h-full -z-10 opacity-5">
        <BgSilk :speed="3" :scale="0.8" :color="'#f0eee7'" :noise-intensity="1.8" :rotation="0" />
    </div>
    <footer class="fixed bottom-0 left-0 w-full p-4 flex justify-between gap-2 text-black/50 text-sm">
        <div class="flex items-center gap-2">
            <template v-for="(link, index) in footerLinks" :key="link.id">
                <a :href="link.url" target="_blank" class="hover:text-black transition-colors">
                    {{ link.title }}
                </a>
                <span v-if="index < footerLinks.length - 1">·</span>
            </template>
        </div>
        <span class="">© {{ thisYear }}</span>
    </footer>
</template>
