<template>
	<div class="com-status-bar">
		<!-- 状态 -->
		<div class="api-key-box" v-if="num !== null">
			<div class="process" :style="`width: ${percent}%`"></div>
			本月剩余可用<span class="num">{{ total - num }}</span
			>次
		</div>

		<!-- 清除缓存 -->
		<div class="reset-box" @click="showResetModal = true">
			清除
		</div>

		<van-popup class="reset-modal" v-model="showResetModal" get-container="#app" close-on-popstate>
			<div class="reset-modal-box">
				<h4>是否清除配置信息？</h4>
				<van-button class="my-btn" @click="resetConfig">确认清除</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script>
import { sleep, isDefObj, isDefStr, isDefNum, store } from '../../../common/utils';
import Tinify, { getCompressionCount } from '../node-compress/Tinify';

export default {
	data: () => ({
		total: 500,
		num: null /* 已用次数 */,

		showResetModal: false,
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
		this.$bus.on('refresh', this.getCurrCount);
		this.getCurrCount();
	},
	methods: {
		/* 获取最新数量 */
		getCurrCount() {
			getCompressionCount().then((currNum) => {
				this.num = currNum;
			});
    },
    
    /* 清除配置信息 */
    resetConfig(){
      store.clear()
      this.$router.replace('/check')
    }
	},
	beforeDestroy() {
		this.$bus.off('refresh', this.getCurrCount);
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

$mainColor: $darkBlue;

.com-status-bar {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 1;

	@include flex-row(space-between, stretch);

	.api-key-box,
	.reset-box {
		box-sizing: border-box;
		font-weight: 600;
		padding: 0.2em 0.6em;
	}
	.api-key-box {
		width: 200px;
		color: $yellow;
		background-color: $mainColor;
		border: 1px solid $mainColor;
		border-top: none;
		border-bottom-right-radius: 4px;
		text-align: center;

		.num {
			padding: 0 4px;
			display: inline-block;
			min-width: 1em;
			text-align: center;
		}

		position: relative;
		z-index: 1;
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

	/**重置配置 */
	.reset-box {
		position: absolute;
		top: 0;
		right: 0;
		text-align: right;
		color: $mainColor;
		border-left: 1px solid $mainColor;
		border-bottom: 1px solid $mainColor;
		border-bottom-left-radius: 4px;
		padding-left: 2.1em;

		@include icon-reset;
		background-position: left 6px center;
	}
}

/**popup挂载在#app上 */
.reset-modal-box {
	background-color: $white;
  border-radius: 4px;
  padding: 0 18px 18px;
  @include flex-col(flex-start, center);
  .my-btn{
    
  }
}
</style>
