<template>
	<!-- 输出模式 -->
	<div class="com-output-mode" v-drag.file="dragFinishHandler">
		<div class="path-box">
			<div class="left">输出路径:</div>

			<!-- 路径 + 选择按钮 -->
			<div class="right">
				<div class="line">
					<span class="path" @click="openPath(outPath)">{{ outPath }}</span>
					<label for="dir-input" class="my-btn change" v-if="outPath">更改</label>
				</div>
			</div>

			<!-- 选择文件夹 -->
			<input type="file" class="hidden" id="dir-input" webkitdirectory directory @change="changeOutPath" />
		</div>

		<div class="name-box">
			<label class="left" for="filename-template">文件名模板：</label>
			<div class="right">
				<div class="line">
					<span class="path">{{ filenameTemplate }}</span>
					<div class="my-btn" @click="showTemplateModal = true">更改</div>
				</div>
			</div>
		</div>
		<modal-change-template
			:show="showTemplateModal"
			@close="showTemplateModal = false"
			@update="(val) => (this.filenameTemplate = val)"
		></modal-change-template>
	</div>
</template>

<script>
import { typify, execPro, homeDir, store } from '../../../common/utils';
import { modeItems } from '../com-type/mode';
import ModalChangeTemplate from './modal-change-template';

const defHomeDir = `${homeDir}/Desktop`;
const defTemplate = '{name}';

export default {
	components: { ModalChangeTemplate },
	data: () => ({
		outPath: store.get('outPath') /* 默认 */,
		filenameTemplate: store.get('filenameTemplate') /* 输出文件名称模板 */,
		showTemplateModal: false,
	}),
	created() {
		/* 监听: outPath */
		store.listenOutPath((curr) => {
			this.outPath = curr;
		});
		/* 监听: filenameTemplate */
		store.listenFilenameTemplate((curr) => {
			this.filenameTemplate = curr;
		});

		/* 读取并赋值(默认, 个人文件夹) */
		{
			const newOutPath = this.outPath.length ? this.outPath : homeDir;
			store.set('outPath', newOutPath);
		}
	},
	methods: {
		/**
		 * 更新输出(文件夹)路径: 拖动文件夹
		 */
		dragFinishHandler(files) {
			files = files.map(typify).filter((file) => file.isDir);

			if (files.length) {
				store.set('outPath', files[0].path);
			}
		},
		/**
		 * 更新输出(文件夹)路径: 手动选择
		 */
		changeOutPath(e) {
			const outFiles = Array.from(e.target.files);
			const newOutPath = outFiles[0].path;
			store.set('outPath', newOutPath);
		},
		/**
		 * 打开路径
		 */
		openPath(path) {
			path = path || this.outPath;
			execPro(`open ${path}`);
		},
  },
  beforeDestroy(){
    store.listenOutPath.unSubscribe()
    store.listenFilenameTemplate.unSubscribe()
  }
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

/* 输出模式 */
.com-output-mode {

	.path-box,
	.name-box {
		@include flex-row(space-between, flex-start);

		.left,
		.right {
			min-height: 30px;
			line-height: 30px;
		}
		.left {
			width: 7em;
		}
		.right {
			flex: 1;
			@include flex-col(flex-start, stretch);
			.line {
				flex: 1;
				@include flex-row(space-between, center);

				.path {
					display: inline-block;
					padding: 0;
					color: $darkBlue;

					font-size: $fontSize * 1;
					height: 1.25em;
					line-height: 1.25em;
				}
				.my-btn {
					width: 80px;
					cursor: pointer;
					user-select: none; /* 禁止选中文本 */
				}
			}

			.line.example {
				font-size: 12px;
				color: gray;
			}
		}
	}

	/** 路径 */
	.path-box {
		.path {
			cursor: pointer;
			border-bottom: 1px solid $darkBlue;
		}
	}
	/** 名称模板 */
	.name-box {
		margin-top: 8px;
	}
}
</style>
