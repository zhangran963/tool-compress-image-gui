<template>
	<div class="com-api-key" v-if="num !== null">
		<div class="process" :style="`width: ${percent}%`"></div>
		本月剩余可用<span class="num">{{ total - num }}</span
		>次
	</div>
</template>

<script>
import { sleep, isDefObj, isDefStr, isDefNum } from '../../../common/utils';
import Tinify from '../node-compress/Tinify';

export default {
	data: () => ({
		total: 500,
		num: null, /* 已用次数 */
	}),
	computed: {
		/* 使用量百分比 */
		percent() {
			if (isDefNum(this.num)) {
				return (this.num / this.total) * 100;
			} else {
				return 0;
			}
		},
	},
	created() {
		this.getCurrCount();

		this.$bus.on('decrease', this.decreaseFunc);
	},
	methods: {
		/* 减少 */
		decreaseFunc() {
			this.num = this.num + 1;
		},
		/* 获取最新数量 */
		getCurrCount() {
			Tinify.getCompressionCount().then((currNum) => (this.num = currNum));
		},
	},
	beforeDestroy() {
		this.$bus.off('decrease', this.decreaseFunc);
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

$mainColor: $darkBlue;

.com-api-key {
	color: $yellow;
	box-sizing: border-box;
	font-weight: 600;
	background-color: $mainColor;

	position: absolute;
	padding: 0.2em 0.6em;
	right: 0;
	top: 0;
	z-index: 1;
	border-bottom-left-radius: 4px;
	border-left: 1px solid $mainColor;
	border-bottom: 1px solid $mainColor;

	.num {
		padding: 0 4px;
		display: inline-block;
		min-width: 1em;
		text-align: center;
	}

	.process {
		$processColor: rgba(
			$color: $red,
			$alpha: 0.8,
		);

		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0;
		z-index: -1;
		background-image: repeating-linear-gradient(
			120deg,
			transparent 0,
			transparent 5px,
			$processColor 0,
			$processColor 10px
		);
		border-right: 1px solid rgba($color: $processColor, $alpha: 0.5);
	}
}
</style>
