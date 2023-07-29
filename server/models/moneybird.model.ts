import axios from "axios";
import type { MoneybirdOauthResponse } from "../types/moneybird";
import { logger } from "../utils/logger";
import config from "../utils/config";

export const getMoneybirdUrl = (): Promise<string> => {
    const url = new URL("https://moneybird.com/oauth/authorize");
    if (
        !(
            "MONEYBIRD_CLIENT_ID" in process.env &&
            process.env.MONEYBIRD_CLIENT_ID && process.env.MONEYBIRD_REDIRECT_URI
        )
    ) {
        return Promise.reject("Not valid uri");
    } else {
        url.searchParams.append("client_id", process.env.MONEYBIRD_CLIENT_ID);
        url.searchParams.append("redirect_uri", process.env.MONEYBIRD_REDIRECT_URI);
        url.searchParams.append("response_type", "code");
        return Promise.resolve(url.toString());
    }
};

export const getMoneybirdToken = (
    code: string
): Promise<MoneybirdOauthResponse> => {
    return new Promise((resolve, reject) => {
        if (
            !(
                "MONEYBIRD_CLIENT_SECRET" in process.env &&
                process.env.MONEYBIRD_CLIENT_SECRET
            )
        ) {
            return reject("Code not found");
        } else {
            const params = new FormData()
            params.append('client_id', <string>process.env.MONEYBIRD_CLIENT_ID)
            params.append('client_secret', <string>process.env.MONEYBIRD_CLIENT_SECRET)
            params.append('code', code)
            params.append('redirect_uri', <string>process.env.MONEYBIRD_REDIRECT_URI)
            params.append('grant_type', "authorization_code")

            axios
                .post("https://moneybird.com/oauth/token", params)
                .then((res) => {
                    return resolve(<MoneybirdOauthResponse>res.data);
                })
                .catch((err) => {
                    return reject(err);
                });
        }
    });
};


export const getMoneybirdAdministrations = (): Promise<any> => {  
    return new Promise((resolve, reject) => {
        axios
            .get('https://moneybird.com/api/v2/administrations.json', {
                headers: {
                    'Authorization': `Bearer ${config.MONEYBIRD_TOKEN}`
                }
            })
            .then(res => {
                logger.debug('fetched administrations')
                return resolve(res.data)
            })
            .catch(err => {
                logger.error('Could not fetch administration id!')
                return reject(err.data)
            })  
    })
}
