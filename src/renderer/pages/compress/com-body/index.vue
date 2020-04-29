<template>
	<!-- 拖放区域 -->
	<div class="com-body">
		<!-- 纯压缩模式 -->
		<com-path-file v-if="modeIndex === 0"></com-path-file>

		<!-- base64模式 -->
		<com-base64-file v-else></com-base64-file>
	</div>
</template>

<script>
import ComPathFile from './path-file';
import ComBase64File from './base64-file';

export default {
	props: { modeIndex: { type: Number } },
	components: { ComPathFile, ComBase64File },
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

.com-body {
	margin: 10px auto;
	box-sizing: border-box;
	width: calc(100% - 2em);
}

.tip-box {
	position: absolute;
	left: 0;
	bottom: 0;

	.tip {
		color: green;
		font-size: 13px;
		padding-left: 1em;
		padding-bottom: 1em;

		&.error {
			color: red;
		}
	}
}
</style>
