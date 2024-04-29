import axios from "axios";
import store from '@/store'
// import jwt_decode from "jwt-decode";
// import router from "./router";

const authMethod = {
    getToken() {
        // let date = new Date().getTime() / 1000;
        let access = localStorage.getItem("token");
        // let refresh = localStorage.getItem("refresh");
        // let decode_access = jwt_decode(access);
        // let decode_refresh = jwt_decode(refresh);
        // if (decode_access.exp > date) {
        //     return access;
        // } else if (decode_refresh.exp > date) {
        //     return refresh;
        // } else {
        // localStorage.removeItem("user_id");
        // localStorage.removeItem("verified");
        // localStorage.removeItem("access");
        // localStorage.removeItem("refresh");
        // localStorage.clear();
        // sessionStorage.removeItem("session");
        // sessionStorage.clear();
        // store.state.Auth.checkStatus = "LOGIN";
        // store.state.isPrivate = false;
        // store.state.Auth.flagVerified = false;
        // router.push({ name: "AuthPage" });
        return access;
        // }
    },
    errorHandler(response) {
        switch (response.status) {
            case 400:
                store.dispatch(
                    "snackBar/showSnack",
                    {
                        text: response.data,
                        color: "error",
                        timeout: 4500,
                    },
                    { root: true }
                );
                break;
            case 401:
                store.dispatch(
                    "snackBar/showSnack",
                    {
                        text: "Unauthorized",
                        color: "error",
                        timeout: 1500,
                    },
                    { root: true }
                );
                localStorage.removeItem("user_id");
                localStorage.removeItem("verified");
                localStorage.removeItem("access");
                // localStorage.removeItem("refresh");
                // localStorage.clear();
                // sessionStorage.removeItem("session");
                // sessionStorage.clear();
                // router.push({ name: "AuthPage" });
                break;
            case 403:
                store.dispatch(
                    "snackBar/showSnack",
                    {
                        text: "Forbidden Request",
                        color: "error",
                        timeout: 1500,
                    },
                    { root: true }
                );
                localStorage.removeItem("user_id");
                localStorage.removeItem("verified");
                localStorage.removeItem("access");
                // localStorage.removeItem("refresh");
                // localStorage.clear();
                // sessionStorage.removeItem("session");
                // sessionStorage.clear();
                // router.push({ name: "AuthPage" });
                break;
            case 404:
                if (
                    response.data.message != "undefined" &&
                    response.data.message != null
                ) {
                    store.dispatch(
                        "snackBar/showSnack",
                        {
                            text: "Page not Found",
                            color: "error",
                            timeout: 1500,
                        },
                        { root: true }
                    );
                } else {
                    store.dispatch("snackBar/showSnack", {
                        text: "Invalid API URL",
                        color: "error",
                    });
                }
                break;
            case 440:
                store.dispatch("snackBar/showSnack", {
                    text: "PublicSession Expired",
                    color: "error",
                });
                break;
            default:
                if (response.data) {
                    // store.dispatch("snackBar/showSnack", {
                    //   text: response.data.message,
                    //   color: "error",
                    //   timeout: "4500",
                    // });
                    console.log(response.data)
                } else {
                    console.log(response.data)

                    // store.dispatch("snackBar/showSnack", {
                    //   text: "Something Went Wrong!",
                    //   color: "error",
                    // });
                }
        }
    },
};

export default (
    method,
    url,
    {
        headers = {},
        params = {},
        data = {},
        onSuccess = null,
        onFailure = null,
        onFinally = null,
        responseType = "json",
        onUploadProgress = null,
        onDownloadProgress = null,
        isTokenRequired = true,
        // cancel = false,
    } = {}
) => {
    const methods = ["get", "post", "patch", "put", "delete"];
    if (!methods.includes(method)) return `Method ${method} not allowed.`;
    if (!url) return "url is required";

    var config = {
        method,
        url,
        headers,
        params,
        data,
        responseType,
        onUploadProgress,
        onDownloadProgress,
    };
    // if (cancel) {
    //   source.cancel();
    //   source = axios.CancelToken.source();
    //   config.cancelToken = source.token;
    // }

    if (isTokenRequired) {
        // console.log("token")
        // let token = "Bearer" + " " + authMethod.getToken();
        let token = authMethod.getToken();
        // console.log(token);
        headers["token"] = token;
    }
    return axios(config)
        .then((response) => {
            if (onSuccess != null) {
                onSuccess(response);
            }
        })
        .catch((error) => {
            console.log("error", error);
            // if (onFailure != null) {
            onFailure(error.response);
            // } else {
            authMethod.errorHandler(error.response)
            // console.log("ddd");
            // }
        })
        .finally(() => {
            if (onFinally != null) {
                onFinally();
            }
        });
};
