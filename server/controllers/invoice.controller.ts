import { Request, Response } from "express"
import { getInvoices, getInvoicesPdf, sendInvoicesPdfZip } from "../models/invoice.model"
import nodemailer from 'nodemailer'
import fs from 'fs'
import { emitStatus } from "../socketio"
import { resolve } from "path"
import type { sendInvoicesExportBody } from '../types/invoice' 
import config from "../utils/config"
import { logger } from "../utils/logger"
import { dateFormat } from "../utils/date"


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
    const body: sendInvoicesExportBody = req.body

    // Set Filename
    const fname = `${config.FILENAME_PREFIX}${dateFormat()}.zip`
    const fpath = resolve(__dirname, fname)

    res.status(201).end()   

    const nmail = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: parseInt(config.SMTP_PORT),
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        }
    })

    // Get all the eligible invoices
    const invoices = await getInvoices({
        period: ['prev_quarter'],
        state: ['late', 'open', 'paid', 'pending_payment', 'reminded', 'scheduled', 'uncollectible']
    })
    emitStatus(1, true)

    // Create output file to write temporarily to
    const output = fs.createWriteStream(fpath);
    emitStatus(2, true)

    // Get all the invoices zipped together
    await getInvoicesPdf(invoices, output)
    emitStatus(3, true)

    await nmail.sendMail({
        from: config.MAIL_FROM,
        to: body.email,
        subject: config.MAIL_SUBJECT,
        text: (body?.body ? body.body : config.MAIL_TEXT ),
        attachments: [{'filename': fname, 'content': fs.createReadStream(fpath)}]

      })
    emitStatus(4, true)

    fs.unlinkSync(fpath)

}