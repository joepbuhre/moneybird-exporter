import { hostname } from "os";

export default {
    NODE_ENV: process.env.NODE_ENV || "development",
    BACKEND_PORT: process.env.BACKEND_PORT || 8000,
    LOG_ENABLED: process.env.LOG_ENABLED || "true",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    LOGGER_NAME: process.env.LOGGER_NAME || hostname(),
    MONEYBIRD_TOKEN: "",
    MONEYBIRD_ADMINISTRATION: "",
    MAIL_FROM: process.env.MAIL_FROM || "moneybird-emailer@example.com",
    MAIL_CC: process.env.MAIL_CC || "",
    MAIL_SUBJECT: process.env.MAIL_SUBJECT || "Export van Moneybird facturen",
    MAIL_TEXT: process.env.MAIL_TEXT || "Beste,\n\nVind hier de moneybird facturen\n\nMet vriendelijke groet",
    FILENAME_PREFIX: process.env.FILENAME_PREFIX || "export_",

    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_PORT: process.env.SMTP_PORT || "",
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
}