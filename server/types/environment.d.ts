import { Level } from 'pino' 

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            BACKEND_PORT: number

            LOG_ENABLED: "true" | "false"; // true
            LOG_LEVEL: Level; // debug
            LOGGER_NAME: string; // fridgy

            MONEYBIRD_TOKEN: string
            MONEYBIRD_ADMINISTRATION: string

            MONEYBIRD_CLIENT_ID: string
            MONEYBIRD_CLIENT_SECRET: string
            MONEYBIRD_REDIRECT_URI: string

            MAIL_FROM: string
            MAIL_CC: string
            MAIL_SUBJECT: string
            MAIL_TEXT: string

            FILENAME_PREFIX: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
