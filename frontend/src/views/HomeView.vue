<template>
    <div class="flex justify-center mt-20 px-10">
        <div class="w-full md:w-2/3 xl:w-1/2 bg-white p-4 rounded-sm shadow-lg ">
            <h3 class="text-xl">Stuur Moneybird Facturen</h3>
            <div>
                <div v-for="step in steps" :class="{ 'opacity-20': !step.done }" class="mt-5 flex">
                    <span>
                        <component :is="step.icon" />
                    </span>
                    <p class="mx-3">
                        {{ step.text }}
                    </p>
                </div>
            </div>
            <div class="mt-5">
                <button @click="sendEmail"
                    class="bg-blue-600 text-white px-2 py-1 border-sm hover:opacity-80 hover:shadow-md">Verstuur Alle PDF's
                    als Email</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FileText, FileArchive, FileStack, Send } from 'lucide-vue-next'
import { api } from '../utils/api'
import { useNotifications } from '../store/notification'
import { onMounted, ref } from 'vue';
import io from 'socket.io-client'

const not = useNotifications()

onMounted(() => {
    const socket = io('http://localhost:8000')
    socket.on('state', (args: {statusEnum: string, state: boolean}) => {
        steps.value[args.statusEnum].done = args.state
        if(args.statusEnum === '4') {
            not.add('Alles sucesvol verstuurd!', 'success', 10000)
        }
    })
})

const sendEmail = () => {
    not.add('Test Success', "info", 10000)

    api
        .post('/invoices/send-export')
        .then(res => {

        })
        .catch(err => {

        })
}

type Step = {
    icon: any
    text: string,
    done: boolean
}

const steps = ref<{ [key:string]: Step }>(
    {
        '1': {
            icon: FileText,
            text: "Alle facturen opgehaald",
            done: false
        },
        '2': {
            icon: FileArchive,
            text: "Zip bestand aangemaakt",
            done: false
        },
        '3': {
            icon: FileStack,
            text: "Alle facturen als PDF opgeslagen",
            done: false
        },
        '4': {
            icon: Send,
            text: "Mail verstuurd!",
            done: false
        }
    }
)


</script>