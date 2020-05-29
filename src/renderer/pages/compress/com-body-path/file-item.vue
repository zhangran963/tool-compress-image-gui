<template>
	<div class="com-file-item">
		<!-- 图标 -->
		<div class="animation-items">
			<com-animation-wait class="animation-item" v-if="file.status === 1"></com-animation-wait>
			<com-animation-process class="animation-item" v-if="file.status === 2"></com-animation-process>
			<com-animation-success class="animation-item" v-if="file.status === 3"></com-animation-success>
			<com-animation-fail class="animation-item" v-if="file.status === 4"></com-animation-fail>
		</div>
		<!-- 信息 -->
		<div class="center">
			<p class="name-path">
				<span class="name">{{ file.name }}</span>
				<span class="path">{{ file.path }}</span>
			</p>
			<p class="size" v-if="file.prevSize || file.currSize">
				<span v-if="file.prevSize">{{ file.prevSize }}</span>
				<span v-if="file.currSize"> >> {{ file.currSize }}</span>
			</p>
		</div>
		<!-- 操作区 -->
		<div class="operation">
			<van-button class="delete btn" v-if="[3, 4].includes(file.status)" @click="$emit('delete')"></van-button>
		</div>
	</div>
</template>

<script>
import ComAnimationWait from './animation/wait';
import ComAnimationProcess from './animation/process';
import ComAnimationSuccess from './animation/success';
import ComAnimationFail from './animation/fail';
import { fsStat, effectify } from '../../../common/utils';

export default {
	props: { file: { type: null } },
	components: { ComAnimationWait, ComAnimationProcess, ComAnimationSuccess, ComAnimationFail },
	data: () => ({
		prevSize: '',
		currSize: '',
	}),
	created() {
		
	},
};
</script>

<style scoped lang="scss">
@import '~@/style/index.scss';

.com-file-item {
	@include flex-row(space-between, center);
	margin-bottom: 10px;
	&:last-child {
		margin-bottom: 0;
	}
	padding: 8px 0;
	background-color: $gray;
	border-radius: $borderRadius;

	.animation-items {
		width: 52px;
		height: 52px;
		// border: 1px solid;
		@include flex-row(center, center);
	}
	.center {
		flex: 1;
		padding: 0 10px;

		.name-path {
			white-space: nowrap;
			@include flex-row(flex-start, center);

			/**名称 */
			.name {
				flex-shrink: 0;
				margin-right: 1em;
				font-weight: bolder;
			}
			/**路径 */
			.path {
				flex: 1;
				width: 0;
				font-size: $fontSize;
				color: gray;
				@include oneline;
				direction: rtl;
				text-align: left;
			}
		}
		/**操作 */
		.size {
			margin-top: 5px;
		}
	}
	.operation {
		.btn,
		.delete {
      width: 44px;
      height: 44px;
      @include icon-delete;
      // outline: 1px solid;
		}
	}
}
</style>
