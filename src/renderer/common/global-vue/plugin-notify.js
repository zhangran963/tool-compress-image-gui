import { Notify } from 'vant';
import { sleep } from '../utils';

/* 官方文档使用方法: https://cn.vuejs.org/v2/guide/plugins.html */
export default {
	install(Vue, options) {
		/* 重置提示函数 */
		const defaultDuration = 2000;
		Vue.prototype.$notify = function(message = '', duration = defaultDuration, type = 'primary') {
			const res = Notify({ message, duration, type });
			return sleep(1200, res);
		};
		Vue.prototype.$notify.primary = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'primary');
		};
		Vue.prototype.$notify.danger = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'danger');
		};
		Vue.prototype.$notify.success = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'success');
		};
		Vue.prototype.$notify.warning = function(message = '', duration = defaultDuration) {
			return this(message, duration, 'warning');
    };

	},
};
