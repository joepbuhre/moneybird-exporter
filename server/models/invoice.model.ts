import { moneybirdFilter, sales_invoices } from "../types/moneybird"
import { logger } from "../utils/logger"
import getMoneybirdApi, { setMoneybirdFilter } from "../utils/moneybird"
import fs from 'fs'
import { archive } from "./archive.model"
import { parse } from "path"
import { AxiosRequestConfig } from "axios"
import { Response } from "express"
import config from "../utils/config"


export const getInvoices = (params?: moneybirdFilter): Promise<string[]> => {

    const bird = getMoneybirdApi(config.MONEYBIRD_ADMINISTRATION, config.MONEYBIRD_TOKEN)
    
    let rconfig: AxiosRequestConfig = {}
    if(params) {
        rconfig['params'] = setMoneybirdFilter(params)
    }

    return new Promise((resolve, reject) => {
        bird.get('/sales_invoices', rconfig).then(res => {
            const data: sales_invoices = res.data
            const invoices = data.map(el => {
                return el.id
            })
            logger.debug(`Fetched all eligible invoices ${invoices.length} pcs`)
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
    const bird = getMoneybirdApi(config.MONEYBIRD_ADMINISTRATION, config.MONEYBIRD_TOKEN)

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
    const bird = getMoneybirdApi(config.MONEYBIRD_ADMINISTRATION, config.MONEYBIRD_TOKEN)

    const arch = archive(output)

    let result: any[] = []
    const chunkSize = 5;
    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);

        let promises = Promise.allSettled(
            chunk.map(id => {
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
                        logger.debug(`Archiving invoice: [${fname}]`)
                        arch.append(res.data, { name: fname });
                        resolve(id)
                    })
                    .catch(err => {
                        logger.error('Error has occured')
                        logger.error(err.response.status)
                        logger.error(err.response.headers)
                        reject(err)
                    })
                })
            })
        )
        
        let tmpRes = await promises
        result = [
            ...result,
            ...tmpRes
        ]
        logger.debug(`Done with a chunk, fetching next one`)
    }
    
    // If we're here we're done
    arch.finalize()

    logger.debug(result, 'Fetched result')
    
    return result.filter(el => el.status === 'fulfilled').map(el => el.value)
    
}