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
				<span class="path">{{ file.dir }}</span>
			</p>
      <!-- 压缩文件大小 -->
			<p class="size" v-if="file.prevSize || file.currSize">
				<span v-if="file.prevSize">{{ file.prevSize }}</span>
				<template v-if="file.currSize">
					<span class="divider">></span>
					<span>{{ file.currSize }}</span>
				</template>
			</p>
      <p class="error" v-if="file.error">
        <span>{{ file.error }}</span>
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
};
</script>

<style scoped lang="scss">
@import '~@/style/index.scss';

.com-file-item {
	flex-shrink: 0;
	@include flex-row(space-between, center);
	margin-bottom: 10px;
	padding: 8px 0;
	background-color: $gray;
	border-radius: $borderRadius;

	&:first-child {
		margin-top: 10px;
	}
	&:last-child {
		margin-bottom: 10px;
	}

  // 动画盒子
	.animation-items {
		width: 60px;
    height: 60px;
    margin-left: 5px;
		@include flex-row(center, center);
	}
	.center {
    flex: 1;
    width: 0;  /**保证不超出 */
		padding: 0 10px;

		.name-path {
			white-space: nowrap;
			margin-top: 8px;
			margin-bottom: 9px;
			@include flex-row(flex-start, center);

			/**名称 */
			.name {
        flex-shrink: 0;
        // width: auto;
        max-width: -webkit-fill-available;
				font-size: 1.2em;
        font-weight: bolder;
        @include oneline;
			}
			/**路径 */
			.path {
        flex: 1;
				width: 0;
				margin-left: 1em;
				font-size: $fontSize;
				color: $darkCyan;
				@include oneline;
				direction: rtl;
				text-align: left;
			}
		}
		/**文件大小 */
		.size {
      color: $darkCyan;
      .divider{
        color: #ccc;
        padding: 0 8px;
      }
    }
    /**错误 */
    .error{
      margin-top: 5px;
      color: $red;
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
