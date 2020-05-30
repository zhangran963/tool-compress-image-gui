import Vue from 'vue';

import { RadioGroup, Radio, Notify, Button, Popup, Loading } from 'vant';
/* 单选 */
Vue.use(Radio);
Vue.use(RadioGroup);
/* 按钮 */
Vue.use(Button);
/* 弹出层 */
Vue.use(Popup)
Vue.use(Loading)

import { sleep } from '../utils';

/* 官方文档使用方法: https://cn.vuejs.org/v2/guide/plugins.html */
const NotifyConfig = {
	install(Vue, options) {
		/* 重置提示函数 */
		const defaultDuration = 2000;
		Vue.prototype.$notify = function(message = '', duration = defaultDuration, type = 'primary') {
			const res = Notify({ message, duration, type });
			return sleep(duration, res);
		};
		Vue.prototype.$notify.primary = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'primary');
    };
    Vue.prototype.$notify.success = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'success');
		};
		Vue.prototype.$notify.warning = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'warning');
    };
    Vue.prototype.$notify.error = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'danger');
		};
	},
};
Vue.use(NotifyConfig);
