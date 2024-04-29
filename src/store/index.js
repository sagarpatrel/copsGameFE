import Vue from "vue";
import Vuex from 'vuex'
import snackBar from "./modules/snackBar";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        snackBar,
    }
})