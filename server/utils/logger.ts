// logger.js
import pino, { Logger } from "pino";

// Create a logging instance
export const logger: Logger = pino({
    enabled: process.env.LOG_ENABLED === "true",
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    level: process.env.LOG_LEVEL || "info",
    name: process.env.LOGGER_NAME,
    redact: {
        paths: ["email", "password", "token"],
    },
    // https://github.com/pinojs/pino/issues/674
    timestamp: pino.stdTimeFunctions.isoTime,
});
