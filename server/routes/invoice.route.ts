import { Router } from "express";
import { Invoices, getInvoicesExport, sendInvoicesExport } from "../controllers/invoice.controller";
import { setMoneybirdFilter } from "../utils/moneybird";
import { getInvoices } from "../models/invoice.model";

const invoices = Router()

invoices.get('/', Invoices)

invoices.get('/export', getInvoicesExport)

invoices.post('/send-export', sendInvoicesExport)

export default invoices