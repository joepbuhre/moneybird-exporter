<template>
    <router-view />
    <TheNotification />
</template>

<script setup lang="ts">
import TheNotification from './components/TheNotification.vue';


</script>

<style>
body {
    @apply bg-slate-300
}
</style>

