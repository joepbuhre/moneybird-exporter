import { Level } from 'pino' 

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            FRIDGY_LOCATIONS: string;
            DATABASE_URL: string; // "postgresql://jbuhre:root@localhost:5432/fridgy"
            BACKEND_PORT: string; // 8080

            LOG_ENABLED: "true" | "false"; // true
            LOG_LEVEL: Level; // debug
            LOGGER_NAME: string; // fridgy

            MONEYBIRD_TOKEN: string
            MONEYBIRD_ADMINISTRATION: string

        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
