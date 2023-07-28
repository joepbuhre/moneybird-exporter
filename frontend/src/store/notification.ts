import { defineStore } from 'pinia'

type NotType = "info" | "success" | "error"

interface notObj {
    id: string,
    text: string,
    type: NotType,
    percent: number
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
        add(text: string, type: NotType, timeout: number = 10000) {
            const randId = `ID_${Math.round(Math.random() * 1000).toString()}`
            const obj: notObj = {
                id: randId,
                text: text,
                type: type,
                percent: 100
            }
            this.notifications[randId] = obj

            let intNr = 50
            if(timeout > 0) {
                let i = setInterval(() => {
                    let tempObj = this.notifications[randId]
                    tempObj.percent -= (intNr / timeout) * 100
                }, intNr)

                setTimeout(() => {
                    this.delete(randId)
                    clearInterval(i)
                }, timeout);
            }
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