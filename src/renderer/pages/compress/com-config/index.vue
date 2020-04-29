<template>
	<div class="com-config mode dealwith-mode">
		<!-- 处理模式 -->
		<van-radio-group v-model="index" direction="horizontal" @change="changeHandler">
			<van-radio v-for="(item, i) of items" :key="i" :name="i" shape="square"
				>{{ item.title }}<span class="tip">{{ item.tip }}</span></van-radio
			>
		</van-radio-group>
	</div>
</template>

<script>
import { typify, execPro, writeConfig, sleep, store } from '../../../common/utils';
import { modeItems } from './mode';

export default {
	data: () => ({
		items: modeItems.map((item) => item.mode),
		index: null,
	}),
	created() {
    /* 每次打开, 默认索引是0(压缩模式) */
    // sleep(500).then(_ => {
    //   this.changeHandler(0)
    // })
    console.log('* store', store.apiKey)

    
  },
	methods: {
		changeHandler(i) {
			writeConfig({ modeIndex: i }).then((res) => {
        const newModeIndex = res.modeIndex
				let { changeModeIndex } = this.$parent;
        this.index = newModeIndex;
        // console.log('* ', changeModeIndex, i,newModeIndex)
				changeModeIndex(newModeIndex);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.com-config {
	/* 处理模式 */
	border: 2px dashed $blue;
	padding: 2em 1em;
	background-color: $white;

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
