import { moneybirdFilter, sales_invoices } from "../types/moneybird"
import { logger } from "../utils/logger"
import getMoneybirdApi, { setMoneybirdFilter } from "../utils/moneybird"
import fs from 'fs'
import { archive } from "./archive.model"
import { parse } from "path"
import { AxiosRequestConfig } from "axios"
import { Response } from "express"

const bird = getMoneybirdApi(process.env.MONEYBIRD_ADMINISTRATION, process.env.MONEYBIRD_TOKEN)

export const getInvoices = (params?: moneybirdFilter): Promise<string[]> => {
    let config: AxiosRequestConfig = {}
    if(params) {
        config['params'] = setMoneybirdFilter(params)
    }

    return new Promise((resolve, reject) => {
        bird.get('/sales_invoices', config).then(res => {
            const data: sales_invoices = res.data
            const invoices = data.map(el => {
                return el.id
            })
            return resolve(invoices)
        })
    })
}

/**
 * 
 * @param ids Expects an array of Invoice IDS
 * @returns array of succesfull fetched links
 */
export const sendInvoicesPdfZip = async (ids: string[], res: Response): Promise<string[]> => {
    
    const arch = archive(res)
    res.attachment('test.zip')

    const promises = Promise.allSettled(
        ids.map(id => {
            return new Promise((resolve, reject) => {
                bird.get(`/sales_invoices/${id}/download_pdf`, {
                    responseType: 'arraybuffer', // had to add this one here
                }).then(res => {
                    // Get filename
                    let fname
                    if('content-disposition' in res.headers) {
                        const cd: string = res.headers['content-disposition']
                        const parsed: string[] | null = cd.match(/filename=(.*)/)
                        if(parsed !== null && parsed.length > 1) {
                            fname = JSON.parse(parsed[1])
                        } else {
                            fname = id
                        }
                    }
                    
                    arch.append(res.data, { name: fname });
                    resolve(id)
                })
            })
        })
    )



    const result: any[] = await promises

    // If we're here we're done
    arch.finalize()

    logger.debug(result, 'Fetched result')
    
    return result.filter(el => el.status === 'fulfilled').map(el => el.value)
    
}


export const getInvoicesPdf = async (ids: string[], output: any): Promise<string[]> => {
    
    const arch = archive(output)
    
    const promises = Promise.allSettled(
        ids.map(id => {
            return new Promise((resolve, reject) => {
                bird.get(`/sales_invoices/${id}/download_pdf`, {
                    responseType: 'arraybuffer', // had to add this one here
                }).then(res => {
                    // Get filename
                    let fname
                    if('content-disposition' in res.headers) {
                        const cd: string = res.headers['content-disposition']
                        const parsed: string[] | null = cd.match(/filename=(.*)/)
                        if(parsed !== null && parsed.length > 1) {
                            fname = JSON.parse(parsed[1])
                        } else {
                            fname = id
                        }
                    }
                    
                    arch.append(res.data, { name: fname });
                    resolve(id)
                })
            })
        })
    )



    const result: any[] = await promises

    // If we're here we're done
    arch.finalize()

    logger.debug(result, 'Fetched result')
    
    return result.filter(el => el.status === 'fulfilled').map(el => el.value)
    
}