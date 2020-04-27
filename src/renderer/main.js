import Vue from 'vue';
import axios from 'axios';

import App from './pages/App.vue';
import router from './router';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

import { Button, Notify } from 'vant';
import { sleep } from "./common/utils";
Vue.use(Button);


/* 重置提示函数 */
const defaultDuration = 2000;
Vue.prototype.$notify = function(message = '', duration = defaultDuration, type = 'primary') {
	const res = Notify({ message, duration, type });
	return sleep(1200, res);
};
Vue.prototype.$notify.primary = function(message = '', duration = defaultDuration){
  return this(message, duration, 'primary')
}
Vue.prototype.$notify.danger = function(message = '', duration = defaultDuration){
  return this(message, duration, 'danger')
}
Vue.prototype.$notify.success = function(message = '', duration = defaultDuration){
  return this(message, duration, 'success')
}
Vue.prototype.$notify.warning = function(message = '', duration = defaultDuration){
  return this(message, duration, 'warning')
}




/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	template: '<App/>',
}).$mount('#app');

console.log('* ', process.env.NODE_ENV);
