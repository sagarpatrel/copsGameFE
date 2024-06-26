import axios from "axios";
import store from '@/store'
import jwtDecode from "jwt-decode";
import router from "./router";
import dayjs from "dayjs";
import { urls } from './api-urls';
const authToken = {
    getAccessToken: () => {
        let token = {
            accessToken: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('rtoken')
        }
        return token;
    },
    /**
     * Save access token in local storage
     * @param token
     */
    setAccessToken: (access_token, refresh_token) => {
        localStorage.setItem("token", access_token);
        localStorage.setItem("rtoken", refresh_token);
    },
    /**
     * Remove access token from local storage
     */
    removeAccessToken: () => {
        localStorage.removeItem("token");
    },

};


let CancelToken = axios.CancelToken;
let source = CancelToken.source();

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

let isRefreshing = false;
let requestQueue = [];

const callRequestsFromQueue = (error, access_token) => {
    requestQueue.forEach((req) => {
        if (error) req.reject(error);
        else req.resolve(access_token);
    });
    requestQueue = [];
};

// request interceptor
axios.interceptors.request.use(
    (req) => {
        if (req.headers.authorization) {
            const { accessToken, refreshToken } = authToken.getAccessToken();
            if (accessToken) {
                // console.log(accessToken);
                const refresh = jwtDecode(refreshToken);
                const isRefreshExpired = dayjs.unix(refresh.exp).diff(dayjs()) < 1;
                if (isRefreshExpired) {
                    authToken.removeAccessToken();
                    router.push({ name: "login" });
                    return null;
                }
                return req;
            }
            return null;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const req = error.config;
        if (error.response === 401 && !req._retry) {
            if (error.response.data.code == "user_not_found") {
                authToken.removeAccessToken();
                router.push({ name: "login" });
                return null;
            }
            const { refreshToken } = authToken.getAccessToken();

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    requestQueue.push({ resolve, reject });
                })
                    .then((access_token) => {
                        req.headers["Authorization"] = access_token;
                        return axios(req);
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            }

            req._retry = true;
            isRefreshing = true;

            return new Promise(function (resolve, reject) {
                // console.log(refreshToken);
                axios
                    .post(urls, {
                        refresh_token: refreshToken,
                    })
                    .then((response) => {
                        const access_token = response.data.token;
                        const refresh_token = response.data.token;
                        console.log(access_token, 'access token axios');
                        authToken.setAccessToken(access_token, refresh_token);
                        req.headers["authorization"] = "Bearer " + access_token;
                        callRequestsFromQueue(null, access_token);
                        resolve(axios(req));
                    })
                    .catch((error) => {
                        authToken.removeAccessToken();
                        router.push({ name: "login" });
                        callRequestsFromQueue(error, null);
                        reject(error);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }
        return Promise.reject(error);
    }
);

// let showToast = (snackbar) =>
//     store.dispatch("snackBar/showToast", snackbar);



const errorHandler = (error) => {
    // console.log('my error ,', store);
    // console.log('my error ,', error.message);
    if (error.response) {
        if (!error.response.data) {
            store.dispatch("snackBar/showToast", {
                message: error.data,
                color: "E",
            });
        } else {

            switch (error.response) {
                case 404:
                    store.dispatch("snackBar/showToast", {
                        message: 'Not found',
                        color: "E",
                    });
                    break;
                case 502:
                case 500: {
                    store.dispatch("snackBar/showToast", {
                        message: "Internal Server Error",
                        color: "E",
                    });
                    // showToast({
                    //     message: error.response.data.message,
                    //     color: "E",
                    // });
                    break;
                }
                default: {

                    const _error = error.response.data.detail;
                    if (typeof _error === "object") {
                        Object.keys(_error).forEach((key) => {
                            _error[key].forEach(() => {
                                store.dispatch("snackBar/showToast", {
                                    message: _error,
                                    color: "E",
                                });
                            });
                        });
                    } else {
                        store.dispatch("snackBar/showToast", {
                            message: _error,
                            color: "E",
                        });
                    }
                }
            }
        }
    }
};



export default (
    method,
    url,
    {
        headers = {},
        params = {},
        data = {},
        lookUpKey = '',
        onSuccess = null,
        onFailure = null,
        onFinally = null,
        responseType = "json",
        onUploadProgress = null,
        onDownloadProgress = null,
        isTokenRequired = true,
        cancel = false,
    } = {}
) => {
    const methods = ["get", "post", "patch", "put", "delete"];
    if (!methods.includes(method)) return `Method ${method} not allowed.`;
    if (!url) return "url is required";
    if (lookUpKey) url = url + `${lookUpKey}/`;



    const config = {
        method,
        url,
        lookUpKey,
        headers,
        params,
        data,
        responseType,
        onUploadProgress,
        onDownloadProgress,
    };
    // console.log(config);
    if (cancel) {
        source.cancel();
        source = axios.CancelToken.source();
        config.cancelToken = source.token;
    }

    if (isTokenRequired) {
        const { accessToken } = authToken.getAccessToken();
        // console.log(accessToken);
        headers["authorization"] = `${accessToken}`;
    }
    // console.log(headers);
    // headers['platform'] = keys.WEB;

    return axios(config)
        .then((response) => {
            if (onSuccess != null) {
                onSuccess(response);

                if (config.method != 'get')
                    store.dispatch("snackBar/showToast", {
                        message: response.data.data,
                        color: config.method === 'delete' ? "e" : 's',
                    });
            }
        })
        .catch((error) => {
            // console.log('store', store, 'error ', error);
            if (onFailure != null) {
                onFailure(error.response);
            }
            errorHandler(error);
        })
        .finally(() => {
            if (onFinally != null) {
                onFinally();
            }
        });
};