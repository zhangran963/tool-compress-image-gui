<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import { store } from '../common/utils';

export default {
	name: 'vue-electron',
	created() {
		// window.$router = this.$router;

		document.addEventListener('drop', (e) => e.preventDefault());
		document.addEventListener('dragover', (e) => e.preventDefault());

		window.store = store;
	},
};
</script>

<style lang="scss">
/* @import '~@/style/index.scss': css, img.src 等文件中的绝对路径写法 */
@import '~@/style/index.scss';

hr {
	margin: 0.5em;
}
</style>
