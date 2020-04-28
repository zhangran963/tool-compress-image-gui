import Vue from 'vue';
import axios from 'axios';

import App from './pages/App.vue';
import router from './router';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

import { Button } from 'vant';
Vue.use(Button);
import PluginNotify from "./common/global-vue/plugin-notify";
Vue.use(PluginNotify)

import { sleep } from "./common/utils";


/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	template: '<App/>',
}).$mount('#app');

