<template>
	<div class="compress-container">
		<!-- api状态 -->
		<com-key-status></com-key-status>

		<!-- 操作模式 -->
		<com-config></com-config>

		<com-dealwith :modeIndex="modeIndex"></com-dealwith>

		<!-- 主体/进度 区 -->
		<com-body
			:modeIndex="modeIndex"
			@change="
				(validFile) => {
					this.file = validFile;
				}
			"
		></com-body>

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
import ComDealwith from './com-dealwith';
import ComBody from './com-body/index';

import { clipboard } from 'electron';
import { sleep, BusName, store, originStore,storeEvent } from '../../common/utils';

const imgPath1 = '/Users/ran/Desktop/未命名文件夹/Xnip2020-02-29_00-28-45.jpg';

export default {
	components: { ComKeyStatus, ComConfig, ComDealwith, ComBody },
	data: () => ({
		modeIndex: 0,

		file: null,
		status: null /* 未压缩: null; 压缩中: true; 压缩出错: false */,

		base64: '',
		prevBase64Str: 'data:image/jpg;base64,',
	}),
	watch: {
		file(curr) {
			console.log('* 父组件接收: ', curr);
		},
	},
	mounted() {
    window.store = store
    window.originStore = originStore

    // storeEvent.onApiKey((curr, prev)=>{
    //   console.log('* apiKeys1', curr, prev)
    // })


    // console.log('* store', store.size)
    // store.set('union', '😄')
		// this.base64ifyImage(imgPath1);
		// sleep(2000).then(_ => this.$bus.emit(BusName.apiKey, 'decrease'))
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
	background-color: $gray;
	padding: 30px 0 0;
	overflow: auto;

	> .btn-box {
		.btn {
			padding: 16px 24px;
			border: none;
			outline: none;
			background-color: green;
			border-radius: 2px;
			font-size: 20px;
			color: white;

			&.compressing {
				opacity: 0.5;
			}
		}
	}

	> .base64-box {
		box-sizing: border-box;
		width: 100%;
		// min-height: 300px;
		padding: 10px;

		background-color: rgb(193, 231, 255);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;

		.content {
			@include text-ellipsis(10);

			text-align: justify;
			overflow: auto;
			word-wrap: break-word;
			word-break: break-all;
		}

		position: relative;
		.btn-box {
			position: absolute;
			top: 0;
			right: 0;
			.btn {
				padding-left: 1em;
				padding-right: 1em;
				height: 40px;
			}
		}
	}
}
</style>
