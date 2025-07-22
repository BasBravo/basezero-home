<script setup lang="ts">
import { useAppStore } from '~~/stores/appStore';
const route = useRoute();
const appStore = useAppStore();
</script>

<template>
    <header>
        <div class="flex justify-between items-center px-2 opacity-40">
            <nav class="col-span-1 text-center transition-all duration-300" :class="{ '-translate-x-6': appStore.sidebarOpen }">
                <Logo class="w-24" type="logo" color="black" />
            </nav>
            <div class="flex gap-2 items-center">
                <ButtonLanguage />
                <ButtonAuth />
            </div>
        </div>
    </header>
</template>
