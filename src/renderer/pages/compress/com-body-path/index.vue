<template>
	<div class="com-body-path" :class="files.length ? '' : 'empty'" v-drag.file="receiveHandler">
		<!-- 空列表 -->
		<div class="items-box empty" v-if="files.length === 0">
			<!-- 提示 -->
			<p class="placeholder">可拖放文件到这里</p>
		</div>

		<!-- 列表 -->
		<div class="items-box" v-else>
			<!-- 文件列表 -->
			<com-file-item
				v-for="(file, index) of files"
				:key="index"
				:file="file"
				@delete="deleteItem(index)"
			></com-file-item>
		</div>

		<!-- 按钮 -->
		<div class="btns-box">
			<label for="file-input" class="my-btn add">添加</label>
			<van-button class="my-btn" type="info" v-if="btnStatus === 1" @click="startCompress">开始压缩</van-button>
			<van-button class="my-btn" loading type="info" loading-text="压缩中..." v-else-if="btnStatus === 2" />
			<van-button class="my-btn" type="info" v-else-if="btnStatus === 3" @click="reset">清空</van-button>
		</div>

		<!-- 选择图片用input -->
		<input
			type="file"
			class="hidden"
			id="file-input"
			accept="image/png, image/jpeg, image/jpg"
			v-input-file="receiveHandler"
		/>
	</div>
</template>

<script>
import { typify, execPro, queue, sleep, path, templatifyFilename, effectify, store } from '../../../common/utils/index';
import { Tinify } from '../node-compress/Tinify';
import ComFileItem from './file-item';
const fs = require('fs');

export default {
	components: { ComFileItem },
	data: (vm) => ({
		files: [],
		btnStatus: null,
		prevLength: 0,
	}),
	created() {
		this.files = myStorage.getItem('files') || [];
	},
	watch: {
		files: {
			deep: true,
			immediate: true,
			handler(currFiles, prevFiles) {
				const that = this;
				if (Array.isArray(currFiles) && Array.isArray(prevFiles)) {
					/* 状态 */
					let statusArr = currFiles.map((file) => file.status);
					if (statusArr.length === 0) {
						this.btnStatus = null;
					} else if (statusArr.some((item) => item === 1)) {
						this.btnStatus = 1; /* 全部等待中: 开始压缩 */
					} else if (statusArr.some((item) => item === 2)) {
						this.btnStatus = 2; /* 部分压缩中: 进度 */
					} else if (statusArr.every((item) => item === 3)) {
						this.btnStatus = 3; /* 全部压缩完成: 清空 */
					}

					const addFiles = currFiles.slice(prevFiles.length, currFiles.length);
					addFiles.forEach((file) => {
						if (file.status === 1 /* 等待状态 */) {
							queue.push(this.createPromise);
						} else {
							/* 其他状态, 保持不变 */
							queue.push(file);
						}
					});
				}
			},
		},
	},
	methods: {
		/* 拖放元素 */
		receiveHandler(newFiles) {
			newFiles = newFiles.map((file) => typify(file));
			/* 过滤: 已存在的数据 + 文件夹 */
			let filteredFiles = newFiles
				.filter((newFile) => {
					const isExist = !this.files.some((file) => file.path === newFile.path);
					return isExist && !newFile.isDir;
				})
				.map((file) => {
					/* 状态: 1等待, 2压缩中, 3完成, 0出错 */
					file.status = 1;
					/* 添加原文件大小 */
					const { size } = fs.statSync(file.path);
					file.prevSize = effectify(size / 1024, 2, true) + 'kb';
					return file;
				});

			this.files = this.files.concat(filteredFiles);
		},

		/* 总处理: 开始, 全部完成 */
		startCompress() {
			// myStorage.setItem('files', this.files)
			const { filenameTemplate = '', outPath = '' } = store.store;
			this.outPath = outPath;
			this.filenameTemplate = filenameTemplate;

      /* 数据已保存 */
			queue()
				.then((res) => {
					console.log('* all', res);
				})
				.catch((err) => {
					console.error('* err', err);
				})
				.finally(() => {
					this.prevLength = this.files.length;
				});
		},

		/* 单项处理: 路径处理, 压缩 */
		createPromise(index) {
			const currIndex = this.prevLength + index;
			const file = this.files[currIndex];
			/* 解析路径 */
			const { originPath, formatPath, originFilename, formatFilename } = this.decodeOutputInfo(file.path, currIndex);
			file.status = 2;

			// return sleep(3000, formatPath).then((res) => {
			// 	this.$notify.success(`压缩成功: ${originFilename} => ${formatFilename}`, 5000);
			// 	file.status = 3;
			// 	/* 添加输出文件大小 */
			// 	file.currSize = '11.1' + 'kb';
			// 	return res;
			// });

			return Tinify.fromFile(originPath)
				.toFile(formatPath)
				.then((res) => {
					this.$notify.success(`压缩成功: ${originFilename} => ${formatFilename}`);
					file.status = 3;
					/* 添加输出文件大小 */
					const { size } = fs.statSync(formatPath);
					file.currSize = effectify(size / 1024, 2, true) + 'kb';
					return sleep(1000, file);
				})
				.catch((err) => {
					file.status = 4;
					console.error('单文件', err);
				}).finally(err => {
          /* 剩余压缩次数减一 */
          this.$bus.emit('decrease')
        })
		},

		decodeOutputInfo(originPath /* 原始路径+名称 */, index) {
			const outPath = this.outPath; /* 输出路径 */
			const filenameTemplate = this.filenameTemplate; /* 输出名称 */

			/* 解析原始路径 */
			let parsePathObj = path.parse(originPath);
			const originFilename = parsePathObj.name;
			/* 模板化('新名称')+格式 */
			const formatFilename = templatifyFilename(filenameTemplate, index, parsePathObj.name) + parsePathObj.ext;
			/* 新输出路径 */
			const formatPath = path.format({
				root: '/',
				dir: outPath,
				base: formatFilename,
			});

			return { formatPath, originPath, originFilename, formatFilename };
		},

		/* 删除单项 */
		deleteItem(index) {
			this.files.splice(index, 1);
			this.prevLength -= 1;
		},
		/* 重置 */
		reset() {
			this.files = [];
			this.prevLength = 0;
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.com-body-path {
	.items-box {
		min-height: 180px;
		@include flex-col(flex-start, stretch);
	}
	.items-box.empty {
		.placeholder {
			flex: 1;
			@include flex-row(center, center);
			color: darkgray;
		}
		.placeholder,
		.add {
			align-self: center;
		}
	}

	// 按钮盒子
	.btns-box {
		@include flex-row(center, center);
		.my-btn {
			margin: 0 10px;
		}
	}
}
</style>
