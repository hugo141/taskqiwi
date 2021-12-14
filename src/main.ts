import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import datastore from "./plugins/datastore"
import editstore from "./plugins/editstore"

Vue.config.productionTip = false;
Vue.prototype.$database = datastore;
Vue.prototype.$editdata = editstore;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
