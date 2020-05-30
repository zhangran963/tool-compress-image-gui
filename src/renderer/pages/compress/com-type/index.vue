<template>
	<div class="com-type">
		<!-- 处理模式 -->
		<van-radio-group class="mode-items" v-model="index" direction="horizontal" @change="changeHandler">
			<van-radio class="mode-item" v-for="(item, i) of items" :key="i" :name="i" shape="square"
				>{{ item.title }}<span class="tip">{{ item.tip }}</span></van-radio
			>
		</van-radio-group>

		<!-- 处理方式 -->
		<com-path class="dealwith-box" v-if="index === 0"></com-path>
	</div>
</template>

<script>
import { typify, execPro, sleep, store, isDefNum } from '../../../common/utils';
import { modeItems } from './mode';

import ComPath from './by-path';
import ComBase64 from './by-base64';

export default {
	components: { ComPath, ComBase64 },
	data: () => ({
		items: modeItems.map((item) => item.mode),
		index: store.get('modeIndex'),
	}),
	created() {
		/* 监听 */
		store.listenModeIndex((curr, prev) => {
			isDefNum(curr) && (this.index = curr);
		});
	},
	methods: {
		/**
		 * 更改模式索引
		 */
		changeHandler(i) {
			isDefNum(i) && store.set('modeIndex', i);
		},
  },
  beforeDestroy(){
    store.listenModeIndex.unSubscribe()
  }
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.com-type {
  $padding: 1em;

	/* 处理模式 */
	padding: 1.5 * $padding 0;
	background-color: $white;

	.mode-items {
    padding: 0 $padding;
    
    .mode-item{
      padding: 8px 0;
    }
	}
	.dealwith-box {
    padding: $padding $padding 0;
		cursor: default;
    background-color: $white;
    box-sizing: border-box;
	}

	/deep/ .van-radio {
		overflow: visible;

		.van-radio__label {
			position: relative;

			.tip {
				display: inline-block;
				white-space: nowrap;
				padding-left: 0.48em;
				padding-right: 0.48em;

				font-size: $fontSize * 0.75;
				@include flex-row(flex-start, center);
				font-weight: 600;
				border-radius: $fontSize;
				background-color: $red;
				color: $white;

				position: absolute;
				right: 63px;
				top: -10px;
				transform: translate(100%);
			}
		}
	}
}
</style>
