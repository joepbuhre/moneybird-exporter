import { Request, Response } from "express"
import getMoneybirdApi from "../utils/moneybird"
import { getInvoices, getInvoicesPdf, sendInvoicesPdfZip } from "../models/invoice.model"
import nodemailer from 'nodemailer'
import fs from 'fs'

const bird = getMoneybirdApi(process.env.MONEYBIRD_ADMINISTRATION, process.env.MONEYBIRD_TOKEN)

export const Invoices = async (req: Request, res: Response) => {
    const invoices = await getInvoices({
        'state': ['late', 'open', 'paid', 'pending_payment', 'reminded'],
        'period': ['prev_quarter']
    })
    
    res.send(invoices)
}

export const getInvoicesExport = async (req: Request, res: Response) => {
    const invoices = await getInvoices()
    
    sendInvoicesPdfZip(invoices, res)

}

export const sendInvoicesExport = async (req: Request, res: Response) => {
    const nmail = nodemailer.createTransport({
        host: 'localhost',
        port: 1025
    })
    const invoices = await getInvoices()
    const output = fs.createWriteStream(__dirname + '/example.zip');
    await getInvoicesPdf(invoices, output)

    await nmail.sendMail({
        from: 'noreply@domain.com',
        to: 'whatever@otherdomain.com',
        subject: 'Confirm Email',
        text: 'Please confirm your email',
        html: '<p>Please confirm your email</p>',
        attachments: [{'filename': 'attachment.zip', 'content': fs.createReadStream(__dirname + '/example.zip')}]

      })

    fs.unlinkSync(__dirname + '/example.zip')

    res.end()   
}