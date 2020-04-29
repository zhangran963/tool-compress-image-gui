<template>
	<div class="com-file-item">
		<!-- <com-icon></com-icon> -->
		<com-status-animation class="left" :status="file.status"></com-status-animation>
		<div class="center">
			<p class="name-path">
				<span class="name">{{ file.name }}</span
				><span class="path">{{ file.path }}</span>
			</p>
			<p class="size" v-if="file.prevSize || file.currSize">
				<span v-if="file.prevSize">{{ file.prevSize }}</span
				><span v-if="file.currSize"> >> {{ file.currSize }}</span>
			</p>
		</div>
		<div class="right opeartion">
			<van-button class="delete btn" v-if="[3, 4].includes(file.status)" @click="$emit('delete')"></van-button>
		</div>
	</div>
</template>

<script>
import ComIcon from './icon';
import ComStatusAnimation from './status-animation';
import { fsStat, effectify } from '../../../common/utils';

export default {
	props: { file: { type: null } },
	components: { ComIcon, ComStatusAnimation },
	data: () => ({
    prevSize: '',
    currSize: ''
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
	padding: 8px;
	background-color: $gray;
	border-radius: $borderRadius;

	.left {
	}
	.center {
		flex: 1;
		margin: 0 1em;

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
	.right {
    // width: 80px;
    .btn,.delete{
      @include icon-delete;
    }
	}
}
</style>
