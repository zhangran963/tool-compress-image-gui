import Vue from 'vue';
import axios from 'axios';

import App from './pages/App.vue';
import router from './router';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* 初始化处理 */
import './common/global-vue/init';
import "./common/directives/index";
// import { sleep } from "./common/utils";


new Vue({
	components: { App },
	router,
	template: '<App/>',
}).$mount('#app');
