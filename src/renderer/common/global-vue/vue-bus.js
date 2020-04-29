import Vue from 'vue';

Vue.use(function(Vue) {
	Vue.prototype.$bus = new Vue({
		methods: {
			// 触发:定义触发的函数
			emit(event, ...args) {
				// "触发函数"的内容
				this.$emit(event, ...args);
			},

			// 监听: 定义监听的函数
			on(event, callback) {
				// "监听函数"的内容
				this.$on(event, callback);
			},

			// 销毁: 组件销毁时
			off(event, callback) {
				this.$off(event, callback);
			},
		},
	});
});
