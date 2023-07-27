import { config } from "dotenv";

config({
    path: "./server/.env",
});

import express, { Request, Response, Router, static as _static } from "express";
import cors from "cors";
import { logger } from "./utils/logger";
import { resolve } from "path";


const app = express();

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

router.use('/', (req: Request, res: Response) => {
    res.send('OK')
})

// router.use("/items", items);
// router.use("/locations", locations);
// router.use("/auth", auth)

app.use("/api", router);

process.env.BACKEND_PORT = '8000'

app.listen(process.env.BACKEND_PORT, async () => {
    logger.info(`Listening on ${process.env.BACKEND_PORT} 🚀`);
});
