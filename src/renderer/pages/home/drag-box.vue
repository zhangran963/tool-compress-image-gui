<template>
	<div class="drag-box">
		<!-- 拖放区域 -->
		<div class="drop-zone" @drop="dropHandler" @dragover="preventHandler">
			<p class="placeholder" :style="{ opacity: file ? 0.2 : 1 }">这里可接受外部拖放的文件</p>
			<div v-if="file">
				<p>文件{{ file.isDirectory ? '夹' : '' }}名: {{ file.name }}</p>
				<p v-if="file.isFile">类型: {{ file.type }}</p>
				<p>路径: {{ file.path }}</p>
			</div>
		</div>
		<!-- 提示区域 -->
		<div v-if="file" class="tip-box">
			<p class="tip" :class="file.isValid === false ? 'error' : ''">{{ file.msg }}</p>
		</div>
	</div>
</template>

<script>
const fs = require('fs');

export default {
	data() {
		return {
			file: null,
		};
	},

	watch: {
		file: {
			handler(curr, prev) {
				if (curr && curr.isValid) {
					/* 向外触发事件 */
					this.$emit('change', curr);
				} else {
					console.error('* error: ', curr.msg);
				}
			},
		},
	},
	mounted() {},

	methods: {
		/* 外部拖放: 放下 */
		dropHandler(event) {
			event.preventDefault();

			let { dataTransfer } = event;
			// console.log('* 类型', dataTransfer)
			const file = dataTransfer.files[0];
			const { name, path, type, size } = file;

			const stat = fs.statSync(path);
			const mode = (stat.mode & parseInt('777', 8)).toString(8);
			const isDirectory = stat.isDirectory();
			const isFile = stat.isFile();

			const res = Object.assign(file, { mode, isDirectory, isFile });
			const validObj = this.verifyFile(res);
			this.file = Object.assign(res, validObj);
		},

		/* 外部拖放: 阻止打开 */
		preventHandler(event) {
			/* 阻止默认动作 */
			event.preventDefault();
		},

		dataTransferFile(event) {
			console.log('* ', event.dataTransfer.files[0]);
		},

		verifyFile(file) {
			let res = { isValid: true, msg: '可以压缩' };
			/* 向外触发事件 */
			if (!file) {
				res.isValid = false;
				res.msg = '没参数';
			} else if (!file.isFile) {
				res.isValid = false;
				res.msg = '不能选中文件夹';
			} else if (!/(jpg|jpeg|png)/gi.test(file.type)) {
				res.isValid = false;
				res.msg = `仅支持jpg/jpeg/png格式的图片, 不支持 ${file.type}`;
			}
			return res;
		},
	},
};
</script>

<style lang="scss" scoped>
.drag-box {
	position: relative;

	.drop-zone {
		box-sizing: border-box;
		width: 100%;
		height: 180px;
		background: rgb(255, 231, 154);
		margin-bottom: 10px;
		padding: 10px;

		position: relative;
		.placeholder {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 1;
			color: rgba(0, 0, 0, 0.28);

			font-size: 24px;
		}
	}

	.tip-box {
		position: absolute;
		left: 0;
		bottom: 0;
		.tip {
			color: green;
			font-size: 13px;
			padding-left: 1em;
			padding-bottom: 1em;

			&.error {
				color: red;
			}
		}
	}
}
</style>
