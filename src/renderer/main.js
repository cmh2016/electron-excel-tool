import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import Loading from "muse-ui-loading"
Vue.use(Loading);

import ElementUI from 'element-ui'
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
