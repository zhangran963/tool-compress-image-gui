<template>
	<!-- 输出模式: 剪切板 -->
	<div class="com-output-mode">
		<p class="placeholder">base64字符串自动复制到剪切板</p>
	</div>
</template>

<script>
import { typify, execPro } from '../../../common/utils';
import { modeItems } from '../com-type/mode';

export default {
	props: { modeIndex: { type: Number } },
	data: () => ({}),
	created() {
		
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

/* 输出模式 */
.com-output-mode {

	@include flex-row(center, center);
	.placeholder {
		color: $gray;
		font-size: $fontSize*1.3;
		white-space: nowrap;
	}
}
</style>
