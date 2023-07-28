import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "/api",
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
                return Promise.reject(err);
            }
        }

        // Return to client
        return Promise.reject(err)

    }
);

export { api };
