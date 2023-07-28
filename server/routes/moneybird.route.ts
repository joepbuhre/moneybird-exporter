import config from "../utils/config";
import { handleMoneybirdAdministration, handleMoneybirdRequestToken, handleMoneybirdUrl } from "../controllers/moneybird.controller";
import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";

const moneybird = Router()

moneybird.get('/', handleMoneybirdUrl)

moneybird.get('/administration', handleMoneybirdAdministration)

moneybird.post('/token', handleMoneybirdRequestToken)

export default moneybird