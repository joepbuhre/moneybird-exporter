import axios, { AxiosError } from "axios";
import { getAuthRedirect } from "./helpers";

const api = axios.create({
    baseURL: "/api",
});

export const wff = axios.create({
    baseURL: "https://world.openfoodfacts.org/api/v2",
});

api.interceptors.response.use(
    (res) => {
        return res;
    },
    (err: AxiosError) => {
        const status = err.response?.status

        if(status === undefined) {
            return Promise.reject(err)
        }

        // Logout if unauthorized
        if( status === 403 || status === 401 ) {
            if (import.meta.env.DEV) {
                console.log(getAuthRedirect())
                return Promise.reject(err);
            } else {
                window.location.href = getAuthRedirect();
            }
        }

        // Return to client
        return Promise.reject(err)



    }
);

export { api };
