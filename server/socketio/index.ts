import http from "http";
import { Server } from "socket.io";
import { logger } from "../utils/logger";

let io: Server;

export const socketConnection = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.MONEYBIRD_REDIRECT_URI,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        logger.debug(`Client connected [id=${socket.id}]`);

        socket.on("disconnect", () => {
            logger.debug(`Client disconnected [id=${socket.id}]`);
        });
    });
};

export const emitStatus = (statusEnum: number, state: boolean) => {
    io.emit('state', {statusEnum, state})
}