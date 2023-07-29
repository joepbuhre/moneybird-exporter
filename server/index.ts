import { config as _config } from "dotenv";
_config({
    path: "./server/.env",
});

import express, { Request, Response, Router, static as _static } from "express";
import cors from "cors";
import { logger } from "./utils/logger";
import { resolve } from "path";
import invoices from "./routes/invoice.route";
import mail from "./routes/mail.route";
import http from 'http'
import { socketConnection } from "./socketio"
import config from "./utils/config";
import moneybird from "./routes/moneybird.route";
import fs from 'fs'

const app = express();

const server = http.createServer(app);

socketConnection(server)

const router = Router();

app.use(cors());
app.use(express.json());

if (config.NODE_ENV === "production") {
    // Implement static
    app.use("/", _static(resolve(__dirname, "../frontend")));
    logger.debug('serving frontend from dist')
} else {
    logger.debug("Start frontend with `npm run dev:frontend`");
}

router.get('/', (req: Request, res: Response) => {
    res.send('OK')
})

router.get('/version', (req: Request, res: Response) => {
    res.send(
        {version: fs.readFileSync(resolve('./VERSION')).toString()}
    )
})

router.use('*', (req: Request, res: Response, next) => {
    if('moneybird-administration' in req.headers) {
        logger.debug('Found Moneybird administration, setted for this route')
        config.MONEYBIRD_ADMINISTRATION = <string>req.headers['moneybird-administration']
    }
    if('moneybird-token' in req.headers) {
        logger.debug('Found Moneybird token, setted for this route')
        config.MONEYBIRD_TOKEN = <string>req.headers['moneybird-token']
    }
    next()
})

router.use('/invoices', invoices)

router.use('/mail', mail)

router.use('/moneybird', moneybird)

app.use("/api", router);

server.listen(config.BACKEND_PORT, async () => {
    logger.info(`Listening on ${config.BACKEND_PORT} 🚀`);
});
