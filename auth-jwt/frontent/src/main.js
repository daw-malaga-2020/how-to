import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "axios-vue";
import * as firebase from "firebase";

// const firebaseConfig = {
//   apiKey: "AIzaSyDepPtuqXIYAXQCLjx4myMMsn4UyrNn6TQ",
//   authDomain: "fir-ad324.firebaseapp.com",
//   databaseURL: "https://fir-ad324.firebaseio.com",
//   projectId: "fir-ad324",
//   storageBucket: "fir-ad324.appspot.com",
//   messagingSenderId: "749478724956",
//   appId: "1:749478724956:web:4fb0f9f091f2d70f9a2d99",
// };

// let app = "";

// firebase.initializeApp(firebaseConfig);


axios.defaults.baseURL = "https://auth-jwt-firebase.herokuapp.com/";

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
