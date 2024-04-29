import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.min.css';
import store from './store'
import router from './app-js/router'
import rules from './app-js/rules'
import axios from 'axios'
import axios_req from './app-js/newAxios'
import urls from './app-js/api-urls'

Vue.config.productionTip = false
// Vue.use(vuetify)
// Vue.use(Vuetify)
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

Vue.prototype.$rules = rules;
Vue.prototype.$Axios = axios_req;
Vue.prototype.$apiUrl = urls;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
