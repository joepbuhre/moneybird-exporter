// logger.js
import pino, { Logger } from "pino";
import config from "./config";

// Create a logging instance
export const logger: Logger = pino({
    enabled: config.LOG_ENABLED === "true",
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    level: config.LOG_LEVEL || "info",
    name: config.LOGGER_NAME,
    redact: {
        paths: ["email", "password", "token"],
    },
    // https://github.com/pinojs/pino/issues/674
    timestamp: pino.stdTimeFunctions.isoTime,
});
