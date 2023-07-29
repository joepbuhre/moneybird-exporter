import { defineStore } from "pinia";
import type { MoneybirdOauthResponse } from '../../../server/types/moneybird'
import { useNotifications } from "./notification";
import { api } from "../utils/api";

interface mainStore {
    moneybirdToken: null | MoneybirdOauthResponse,
    moneybirdAdministrations: null | any
}

export const useMain = defineStore("Main", {
    state(): mainStore {
        return {
            moneybirdToken: null,
            moneybirdAdministrations: null
        }
    },
    actions: {
        setMoneybirdToken(obj: MoneybirdOauthResponse) {
            this.moneybirdToken = obj
        },
        setMoneybirdAdministrations() {
            const not = useNotifications()
            api
                .get('/moneybird/administration')
                .then(res => {
                    this.moneybirdAdministrations = res.data
                    not.add(`Welkom ${this.getAdministrations[0].name}`, 'info', 7000)
                })
                .catch(err => {
                    console.warn(err)
                    not.add('Error fetching administrations', 'error', 15000)
                })
        }
    },
    getters: {
        getCode(state) {
            return state.moneybirdToken?.access_token || false
        },
        getAdministrations(state) {
            return state.moneybirdAdministrations || false
        }
    },
    persist: true
});
