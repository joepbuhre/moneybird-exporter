import { defineStore } from 'pinia'

const classes = {
    'info': '',
    'success': 'success',
    'error': 'error',
}

interface notObj {
    id: string,
    text: string,
    classes: string
}

export const useNotifications =  defineStore('Notifications', {
    state: (): { notifications: { [key: string]: notObj } } => {
        return {
            notifications: {}
        }
    },
    getters: {
        get(state) {
            return state.notifications
        }
    },
    actions: {
        add(text: string, type: "info" | "success" | "error", timeout: number = 10000) {
            const randId = `ID_${Math.round(Math.random() * 1000).toString()}`
            const obj: notObj = {
                id: randId,
                text: text,
                classes: classes[type]
            }
            this.notifications[randId] = obj

            setTimeout(() => {
                this.delete(randId)
            }, timeout);
        },
        delete(randId: string) {
            try {
                delete this.notifications[randId]
            } catch (error) {
                console.log(error)
            }
        }
    }
})