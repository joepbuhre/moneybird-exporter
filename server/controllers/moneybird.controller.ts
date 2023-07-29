import { Request, Response } from "express"
import { getMoneybirdAdministrations, getMoneybirdToken, getMoneybirdUrl } from "../models/moneybird.model"
import { logger } from "../utils/logger"
import config from "../utils/config"

export const handleMoneybirdUrl = (req: Request, res: Response) => {
    getMoneybirdUrl()
        .then(url => {
            logger.debug(`Found url!`)
            res.redirect(url)
        })
        .catch(err => {
            logger.error(err)
            res.redirect('back')
        })
        
}

export const handleMoneybirdRequestToken = (req: Request, res: Response) => {
    if('code' in req.body) {
        getMoneybirdToken(req.body.code)
            .then(result => {
                logger.debug('Correctly fetched token')
                res.send(result)
            })
            .catch(err => {
                logger.warn(err, 'Something went wrong')
                res.status(500).send(err.data)
            })
    } else {
        res.status(405).send('Please include code')
    }
}

export const handleMoneybirdAdministration = (req: Request, res: Response) => {
    getMoneybirdAdministrations()
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.send(err)
        })
}