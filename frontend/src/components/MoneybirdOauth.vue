<template>
    <div>
        <p >
        Log in bij moneybird
    </p>
    <a
        href="/api/moneybird"
        class=" bg-blue-600 text-white px-2 py-1 border-sm hover:opacity-80 hover:shadow-md">Log in </a>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../utils/api';
import { useNotifications } from '../store/notification';
import { useMain } from '../store/main';


const route = useRoute()
const router = useRouter()
const not = useNotifications()
const main = useMain()

const handleOauthCode = () => {
    if('code' in route.query) {
        console.log('hii')
        api.post('/moneybird/token', {
            code: route.query.code
        }).then(res => {
            not.add('Succesvol ingelod', 'success', 3000)
            main.setMoneybirdToken(res.data)
            router.push('/')
            main.setMoneybirdAdministrations()
        })
    }
}

onMounted(() => {
    handleOauthCode()
})

</script>