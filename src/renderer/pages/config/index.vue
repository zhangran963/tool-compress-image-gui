<template>
	<div class="page-config">
		<h4 class="title">您需要配置apiKey, 请按如下步骤操作:</h4>
		<section>
			<p>1. 访问:<span class="node pointer" @click="openInBrowser">https://tinypng.com/developers</span>并注册api</p>
			<div class="img-box">
				<img src="https://s1.ax1x.com/2020/05/31/tllL3d.jpg" alt="register" border="0" width="400" />
			</div>
		</section>
		<section>
			<p>2. 查看email，点击<span class="node">[Visit your dashboard]</span></p>
			<div class="img-box">
				<img src="https://s1.ax1x.com/2020/05/31/tllH4e.jpg" alt="email" border="0" width="400" />
			</div>
		</section>
		<section>
			<p>3. 查看您的api</p>
			<div class="img-box">
				<img src="https://s1.ax1x.com/2020/05/31/tllq9H.jpg" alt="api" border="0" width="480" />
			</div>
		</section>
		<section>
			<p>4. 在下方输入框中保存api</p>
			<div class="input-box">
				<input type="text" placeholder="api值" maxlength="32" v-model="apiKey" />
				<van-button class="my-btn" :disabled="!validApiKey" @click="saveFunc">保存</van-button>
			</div>
		</section>
	</div>
</template>

<script>
const { shell } = require('electron');
import { sleep, store } from '../../common/utils';
import { getTinify, getCompressionCount } from '../compress/node-compress';

const checkReg = /^[\da-z]{32}$/gi;
export default {
	data() {
		return {
			apiKey: store.get('apiKey'),
		};
	},
	watch: {
		/* 规范apiKey的输入格式 */
		apiKey(curr) {
			this.apiKey = curr.trim().replace(/[^\da-z]/gi, '');
		},
	},
	computed: {
		/* apiKey格式是否正确 */
		validApiKey() {
			const key = this.apiKey;
			const isValid = typeof key === 'string' && key.length === 32 && checkReg.test(key);
			const isEmpty = typeof key === 'string' && key.length === 0;
			return isValid || isEmpty;
		},
	},
	methods: {
		/* 保存 */
		saveFunc() {
			store.set('apiKey', this.apiKey);
			this.$router.replace('/check');
		},
		/**
		 * 在浏览器中打开
		 */
		openInBrowser() {
			shell.openExternal('https://tinypng.com/developers');
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.page-config {
	cursor: default;
	user-select: none;
	width: 100%;
	min-height: 500px;
	margin: 0 auto;
	background-color: $white;
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	padding: 0 10px 30px;

	.title {
		padding: 10px;
	}
	section {
    padding: 5px 20px;
		p {
			/**关键点 */
			.node {
				font-weight: bolder;
				color: $darkBlue;
				padding: 6px 8px;
			}
			.pointer {
				cursor: pointer;
			}
		}
		.img-box {
      margin-top: 5px;
			@include flex-row(flex-start, center);
			img {
				// width: 360px;
				height: auto;
				display: inline-block;
				margin: 0 auto;
			}
		}

		.input-box {
      margin-top: 5px;
			@include flex-row(space-between, center);
			background-color: $gray;
			display: inline-block;
			border-radius: 2px;
			overflow: hidden;
			input {
				padding: 5px 8px;
				background-color: $gray;
				border-radius: 2px;
				width: 320px;
				color: #333;
			}
			.my-btn {
				color: #333;
				border-color: $gray;
			}
		}
	}

	h1,
	h2,
	h3,
	h4 {
		margin: 0;
		padding: 0;
	}
}
</style>
