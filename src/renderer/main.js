import Vue from 'vue';
import axios from 'axios';

import App from './pages/App.vue';
import router from './router';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* 初始化处理 */
import './common/global-vue/init';
import './common/directives/index';
// import { sleep } from "./common/utils";

/* 类似localStorage */
window.myStorage = {
	setItem(key, value) {
		const jsonStr = JSON.stringify(value);
		localStorage.setItem(key, jsonStr);
  },
  getItem(key){
    const jsonStr = localStorage.getItem(key) || null
    return JSON.parse(jsonStr)
  }
};

new Vue({
	components: { App },
	router,
	template: '<App/>',
}).$mount('#app');
