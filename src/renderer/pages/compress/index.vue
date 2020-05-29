<template>
	<div class="compress-container">
		<!-- api状态 -->
		<com-key-status></com-key-status>

		<!-- 操作模式 -->
		<com-config></com-config>

		<!-- 主体/进度 区 -->
		<com-body-path class="com-body" v-if="modeIndex === 0"></com-body-path>
		<com-body-base64 class="com-body" v-else></com-body-base64>

		<!-- base64图片区 -->
		<!-- .demoImg{ background-image: url("data:image/jpg;base64,/9j/4QMZRXhpZgAASUkqAAgAAAAL...."); } -->
		<!-- <div class="base64-box" :style="{ 'background-image': `url(${prevBase64Str}${base64})` }"> -->
		<!-- <div class="content">
				{{ prevBase64Str + base64 }}
			</div>

			<div class="btn-box">
				<van-button type="primary" class="btn copy" @click="copyHandler">复制</van-button>
			</div> -->
		<!-- </div> -->
	</div>
</template>

<script>
const compress = require('./node-compress/index');
const base64ify = require('./node-base64ify/index');

import ComKeyStatus from './com-key-status';
import ComConfig from './com-config';
import ComBodyPath from './com-body-path/index';
import ComBodyBase64 from './com-body-base64/index';

import { clipboard } from 'electron';
import { sleep, store, isDefNum } from '../../common/utils';

export default {
	components: { ComKeyStatus, ComConfig, ComBodyPath, ComBodyBase64 },
	data: () => ({
		modeIndex: 0,

		file: null,
		status: null /* 未压缩: null; 压缩中: true; 压缩出错: false */,

		base64: '',
		prevBase64Str: 'data:image/jpg;base64,',
	}),
	created() {
		/* 监听 */
		store.listenModeIndex((curr, prev) => {
			isDefNum(curr) && (this.index = curr);
		});
	},
	methods: {
		changeModeIndex(i) {
			this.modeIndex = i;
		},

		/* 压缩 */
		compressHandler() {
			this.status = true;
			compress(this.file.path)
				.then((res) => {
					console.log('* 压缩结果', res);

					/* 剪切板 */
					clipboard.writeText(`输出路径: ${res.outputFullname}`);
					this.$notify.success(`压缩成功，输出路径: ${res.outputFullname}`, 5000);

					/* 恢复状态 */
					this.status = null;

					/* base64化 */
					this.base64ifyImage(res.outputFullname);
				})
				.catch((err) => {
					console.log('* err', err);
					this.status = false;
				});
		},

		/* 重置 */
		resetHandler() {
			this.file = null;
			this.status = null;
		},

		/**
		 * base64化
		 */
		base64ifyImage(imgPath) {
			return base64ify(imgPath)
				.then((str) => {
					this.base64 = str;
					console.log('* base64 ', str);
				})
				.catch((err) => {
					console.log('* err', err);
				});
		},

		copyHandler() {
			/* 剪切板 */
			clipboard.writeText(`${this.prevBase64Str}${this.base64}`);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';
.compress-container {
  background-color: #f5f5f5;
	padding: 30px 0 0;
  overflow: auto;
  user-select: none;
  cursor: default;
  

  .com-body{
    // border: 1px solid;
    padding: 10px;
  }
}
</style>
