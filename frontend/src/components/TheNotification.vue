<template>
    <div class="toast-container absolute bottom-0 right-0 p-3 z-50" >

        <div
            v-for="not in notifications.get"
            class="flex items-center w-full max-w-sm p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 mt-2"
            role="alert">
            <div
                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                <Info />
            </div>
            <div class="ml-3 text-sm font-normal">{{ not.text }}</div>
            <button type="button"
                @click="notifications.delete(not.id)"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            >
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