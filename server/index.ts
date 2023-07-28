import { config } from "dotenv";
config({
    path: "./server/.env",
});

import express, { Request, Response, Router, static as _static } from "express";
import cors from "cors";
import { logger } from "./utils/logger";
import { resolve } from "path";
import invoices from "./routes/invoice.route";
import mail from "./routes/mail.route";
import http from 'http'
import { socketConnection } from "./socketio";

const app = express();

const server = http.createServer(app);

socketConnection(server)

const router = Router();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    // Implement static
    app.use("/", _static(resolve(__dirname, "../frontend")));
    logger.debug('serving frontend from dist')
} else {
    logger.debug("Start frontend with `npm run dev:frontend`");
}

router.get('/', (req: Request, res: Response) => {
    res.send('OK')
})

router.use('/invoices', invoices)

router.use('/mail', mail)

app.use("/api", router);

process.env.BACKEND_PORT = '8000'

server.listen(process.env.BACKEND_PORT, async () => {
    logger.info(`Listening on ${process.env.BACKEND_PORT} 🚀`);
});
