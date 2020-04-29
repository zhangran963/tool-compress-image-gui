<template>
	<!-- 拖放区域 -->
	<div class="com-dealwith">
		<!-- 纯压缩模式 -->
    <com-dealwith-path v-if="modeIndex === 0"></com-dealwith-path>
		<!-- base64模式 -->
    <com-dealwith-base64 v-else></com-dealwith-base64>
	</div>
</template>

<script>
import ComDealwithPath from "./by-path";
import ComDealwithBase64 from "./by-base64";

export default {
	props: { modeIndex: { type: Number } },
	components: { ComDealwithPath, ComDealwithBase64 },
	data() {
		return {};
	},
	mounted() {},
	methods: {
		// /* 外部拖放: 放下 */
		// dragHandler(files) {
		// 	files = files.map((file) => typify(file)).filter((file) => file.isDir);
		// 	if (files.length) {
		// 	}
		// },
		// verifyFile(file) {
		// 	let res = { isValid: true, msg: '可以压缩' };
		// 	/* 向外触发事件 */
		// 	if (!file) {
		// 		res.isValid = false;
		// 		res.msg = '没参数';
		// 	} else if (!file.isFile) {
		// 		res.isValid = false;
		// 		res.msg = '不能选中文件夹';
		// 	} else if (!/(jpg|jpeg|png)/gi.test(file.type)) {
		// 		res.isValid = false;
		// 		res.msg = `仅支持jpg/jpeg/png格式的图片, 不支持 ${file.type}`;
		// 	}
		// 	return res;
		// },
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.com-dealwith {
	
}

</style>
