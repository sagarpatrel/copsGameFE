import store from "@/store";

export default {
    namespaced: true,
    state: {
        show: false,
        config: {
            color: "success",
            message: "",
            top: true,
            bottom: false,
            left: false,
            right: true,
            timeout: 3500,
            multi_line: false,
        },
    },
    mutations: {
        SHOW_SNACK(state, data) {
            state.config.message = data.message;
            state.config.color = data.color || "success";

            state.config.top = !store.state.isMobile;
            state.config.bottom = store.state.isMobile;
            state.config.right = !store.state.isMobile;

            if (state.config.color !== null) {
                if (state.config.color.toLowerCase() === "s") {
                    state.config.color = "success";
                } else if (state.config.color.toLowerCase() === "e") {
                    state.config.color = "error";
                } else if (state.config.color.toLowerCase() === "w") {
                    state.config.color = "warning";
                }
            }
            state.config.timeout = data.timeout || 3000;
            // state.config.multi_line = data.message.length > 30
            state.show = true;
        },
        CLOSE_SNACK(state) {
            state.show = false;
            // state.config.color = "";
            state.config.message = "";
        },
    },
    actions: {
        showToast({ commit }, tabJson) {
            commit("SHOW_SNACK", tabJson);
        },
        hideToast({ commit }) {
            commit("CLOSE_SNACK");
        },
    },
    modules: {},
};