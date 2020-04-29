<template>
	<div class="path-file" :class="files.length ? '' : 'empty'" v-drag.file="receiveHandler">
		<div class="content">
			<!-- 提示 -->
			<p class="placeholder" v-if="files.length === 0">可拖放文件到这里</p>
			<!-- 文件列表 -->
			<com-file-item
				v-for="(file, index) of files"
				:key="index"
				:file="file"
				@delete="deleteItem(index)"
			></com-file-item>
			<!-- "添加"按钮 -->
			<div class="add-btns">
				<label for="file-input" class="my-btn add" v-if="true">{{ files.length ? '继续添加' : '添加' }}</label>
				<!-- 选择文件input -->
				<input
					type="file"
					class="hidden-input"
					id="file-input"
					accept="image/png, image/jpeg, image/jpg"
					v-input-file="receiveHandler"
				/>
			</div>
		</div>

		<div class="compress-btns">
			<van-button type="info" v-if="btnStatus === 1" @click="startCompress">开始压缩</van-button>
			<van-button loading type="info" loading-text="加载中..." v-else-if="btnStatus === 2" />
			<van-button type="info" v-else-if="btnStatus === 3" @click="reset">清空</van-button>
		</div>
	</div>
</template>

<script>
import {
	typify,
	execPro,
	queue,
	sleep,
	readConfig,
	path,
	templatifyFilename,
	effectify,
} from '../../../common/utils/index';
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
	created() {},
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
			return readConfig()
				.then(({ outputPath = '', outputFilename = '' }) => {
					this.outputPath = outputPath;
					this.outputFilename = outputFilename;
					return queue();
				})
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

			// console.log('* ', originPath, formatPath, originFilename);
			// console.log('* ', formatFilename);
			return sleep(1000, formatPath).then((res) => {
				this.$notify.success(`压缩成功: ${originFilename} => ${formatFilename}`);
				file.status = 3;
				/* 添加输出文件大小 */
				file.currSize = '11.1'+'kb';
				return res;
			});

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
					console.error('单文件', err);
					file.status = 4;
				});

			// return sleep(2000, file).then((res) => {
			// 	file.status = 3;
			// 	// console.log('* 单项处理完成', currIndex, res);
			// 	return res;
			// });
		},

		decodeOutputInfo(originPath /* 原始路径+名称 */, index) {
			const outputPath = this.outputPath; /* 输出路径 */
			const outputFilenameTemplate = this.outputFilename; /* 输出名称 */

			/* 解析原始路径 */
			let parsePathObj = path.parse(originPath);
			const originFilename = parsePathObj.name;
			/* 模板化('新名称')+格式 */
			const formatFilename = templatifyFilename(outputFilenameTemplate, index, parsePathObj.name) + parsePathObj.ext;
			/* 新输出路径 */
			const formatPath = path.format({
				root: '/',
				dir: outputPath,
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

.path-file {
	.content {
		background-color: $white;
		box-shadow: 0 2px 6px rgba($color: #000000, $alpha: 0.1), 0 6px 16px rgba($color: #000000, $alpha: 0.08);
		border-radius: $borderRadius;

		.add-btns {
			padding: 28px 0;
			text-align: center;
		}

		position: relative;
		.placeholder {
			color: gray;
			position: absolute;
			left: 50%;
			top: 36%;
			transform: translate(-50%, -50%);
		}
	}

	&.empty {
		.add-btns {
			padding: 110px 0 10px;
		}
	}

	.compress-btns {
		padding: 20px 0;
	}
}
</style>
