<template>
    <div class="toast-container absolute top-0 right-0 p-3 z-50 w-96">

        <div v-for="not in notifications.get"
            class="flex relative items-center w-full max-w-sm p-4 text-gray-500 bg-white rounded-md shadow-lg dark:text-gray-400 dark:bg-gray-800 mt-2"
            role="alert">
            <div :class="{
                'bg-green-500': (not.type === 'success'),
                'bg-red-500': (not.type === 'error'),
                'rounded-br-none': (not.percent) < 100
            }" :style="{ width: `${not.percent}%`}" class="h-1 rounded-b-md absolute bottom-0 left-0 bg-blue-500 animate duration-500 ease-linear"></div>
            <div :class="{
                'text-red-500 bg-red-100': (not.type === 'error'),
                'text-green-500 bg-green-100': (not.type === 'success')
            }"
                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                <Info />
            </div>
            <div class="ml-3 text-sm font-normal">{{ not.text }}</div>
            <button type="button" @click="notifications.delete(not.id)"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
                <X />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNotifications } from "../store/notification";
import { Info, X } from 'lucide-vue-next'

const notifications = useNotifications()

</script>