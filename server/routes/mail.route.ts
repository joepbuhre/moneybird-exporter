import { Request, Response, Router } from "express";
import nodemailer from 'nodemailer'

const mail = Router()

mail.get('/', (req: Request, res: Response) => {
    res.send('hi')
    const nmail = nodemailer.createTransport({
        host: 'localhost',
        port: 1025
    })
    nmail.sendMail({
        from: 'noreply@domain.com',
        to: 'whatever@otherdomain.com',
        subject: 'Confirm Email',
        text: 'Please confirm your email',
        html: '<p>Please confirm your email</p>'
      })
})

export default mail