<template>
    <div class="flex justify-center mt-20 px-10 ">
        <div class="w-full md:w-2/3 xl:w-1/2 bg-white p-4 rounded-sm shadow-lg relative">
            <div v-if="main.getCode === false" class="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 text-center z-50">
                <MoneybirdOauth />
            </div>
            <h3 class="text-xl">Stuur Moneybird Facturen</h3>
            <button @click="logout" class="absolute right-3 top-3">
                <LogOut />
            </button>
            <div class="my-2">
                <h3 class="text-lg">Instellingen</h3>
                <input type="text" id="first_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Vul het email adres hier in" required v-model="email">
            </div>
            <div>
                <h3 class="text-lg">Status</h3>
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
import { FileText, FileArchive, FileStack, Send, LogOut} from 'lucide-vue-next'
import { api } from '../utils/api'
import { useNotifications } from '../store/notification'
import { onMounted, ref } from 'vue';
import io from 'socket.io-client'
import type { sendInvoicesExportBody } from '../../../server/types/invoice'
import MoneybirdOauth from '../components/MoneybirdOauth.vue'
import { useMain } from '../store/main';

const not = useNotifications()
const main = useMain()

onMounted(() => {
    if(main.moneybirdToken !== null) {
        main.setMoneybirdAdministrations()
    }
    const socket = io()
    socket.on('state', (args: { statusEnum: string, state: boolean }) => {
        steps.value[args.statusEnum].done = args.state
        if (args.statusEnum === '4') {
            not.add('Alles sucesvol verstuurd!', 'success', 10000)
        }
    })

    socket.on('error', (mess: string) => {
        not.add(mess, 'error')
    })
})

const sendEmail = () => {
    // Reset all status
    Object.keys(steps.value).forEach(el => {
        steps.value[el].done = false
    })

    if (email.value === '' || email.value === null || email.value === undefined) {
        not.add('Vul alstjeblieft een email adres in', 'error', 30000)
        return false;
    } else {
        not.add('Succesvol taak aangemaakt', "info", 10000)

        api
            .post('/invoices/send-export', <sendInvoicesExportBody>{
                email: email.value,
                body: `Beste,\n\nVind bijgevoegd de facturen van afgelopen kwartaal.\n\nMet vriendelijke groet,\n${main.getAdministrations[0].name}`
            })
            .then(res => {
                not.add('Taak succesvol geaccepteerd', 'info', 10000)
            })
            .catch(err => {
                not.add('Er is iets misgegaan. Probeer het alstjeblieft opnieuw', 'error')
            })
    }
}

type Step = {
    icon: any
    text: string,
    done: boolean
}

const steps = ref<{ [key: string]: Step }>(
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

const logout = () => {
    main.$reset()
    not.add('Succesvol uitgelogd', 'info')
}

// Handle form values
const email = ref<string>('')

</script>