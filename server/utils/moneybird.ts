import axios, { AxiosError, AxiosInstance } from 'axios'
import { logger } from './logger'
import { moneybirdFilter } from '../types/moneybird'

const getMoneybirdApi = (administrationId: string | undefined, bearerToken: string | undefined): AxiosInstance => {
    if(administrationId === undefined || bearerToken === undefined ) {
        logger.error('Please check the env variables administrationId and bearerToken one of them appears to be undefined', {administrationId, bearerToken})
    }
    const bird =  axios.create({
        baseURL: `https://moneybird.com/api/v2/${administrationId}`,
        headers: {
            Authorization: `Bearer ${bearerToken}`
        },
        validateStatus: (status: number) => {
            return status >= 200 && status <= 302
        }
    })

    return bird

}

const tst = [
    [
        'test', [1,2,3,4]
    ]
]

export const setMoneybirdFilter = (obj: moneybirdFilter): {filter: string}  => {
    let params = ''
    Object.entries(obj)
        .forEach((el: [string, string[]]) => {
            params = `${params},${el[0]}:${el[1].join('|')}`
        });
    return {
        filter: params.slice(1)
    }
}

export default getMoneybirdApi