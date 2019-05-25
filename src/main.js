import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import moment from "moment";
import "vue-material-design-icons/styles.css";

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
