<template>
    <router-view />
    <TheNotification />
    <div class="fixed bottom-0 left-0 right-0 flex justify-center text-slate-400">
        <span>Running version: {{ version }}</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TheNotification from './components/TheNotification.vue';
import { api } from './utils/api';

const version = ref<string>('')

onMounted(() => {
    api.get('/version')
        .then(res => {
            version.value = res.data.version
        })
        .catch(err => {
            console.warn(err)
        })
})

</script>

<style>
body {
    @apply bg-slate-300
}
</style>

