import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'axios-vue'

Vue.use(VueAxios, axios);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
