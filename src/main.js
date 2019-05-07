import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import * as api from "./request/api";
import filters from "./filters";
Vue.prototype.$api=api; //api全局挂载
Vue.config.productionTip = false;
Vue.use(Message)

//全局过滤器
Object.keys(filters).forEach(filterName=>{
  Vue.filter(filterName,filters[filterName])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
