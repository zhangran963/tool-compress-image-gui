<template>
	<!-- 输出模式 -->
	<div class="com-output-mode" v-drag.file="dragFinishHandler">
		<div class="path-box">
			<div class="left">输出路径:</div>

			<!-- 路径 + 选择按钮 -->
			<div class="right">
				<div class="line">
					<span class="path" @click="openPath(outputPath)">{{ outputPath }}</span>
					<label for="dir-input" class="my-btn change" v-if="outputPath">更改</label>
				</div>
			</div>

			<!-- 选择文件夹 -->
			<input type="file" class="hidden-input" id="dir-input" webkitdirectory directory @change="changeOutputPath" />
		</div>

		<div class="name-box">
			<label class="left" for="name-template">文件名模板：</label>
			<div class="right">
				<div class="line">
					<span class="path">{{ template }}</span>
					<div class="my-btn" @click="showTemplateModal = true">更改</div>
				</div>
				<!-- <div class="line example">
          <span>示例："{name}-{date}" 会输出 "原始文件名-20200501.jpg"</span>
        </div>
         -->
			</div>
		</div>
		<modal-change-template
			:show="showTemplateModal"
			@close="showTemplateModal = false"
			@update="(val) => (this.template = val)"
		></modal-change-template>
	</div>
</template>

<script>
import { typify, execPro, homeDir, writeConfig, readConfig } from '../../../common/utils';
import { modeItems } from '../com-config/mode';
import ModalChangeTemplate from './modal-change-template';

const defHomeDir = `${homeDir}/Desktop`;
const defTemplate = '{name}';

export default {
	components: { ModalChangeTemplate },
	props: { modeIndex: { type: Number } },
	data: () => ({
		outputPath: '' /* 默认 */,
		template: defTemplate,
		showTemplateModal: false,
	}),
	created() {},
	mounted() {
		readConfig().then((res) => {
			res.outputPath = res.outputPath || defHomeDir;
			res.outputFilename = res.outputFilename || defTemplate;

			writeConfig(res).then((res) => {
				this.outputPath = res.outputPath;
				this.template = res.outputFilename;
			});
		});
  },
  watch: {
    outputPath(newVal){
      if(newVal.length){
        writeConfig({outputPath: newVal})
      }
    },
    template(newVal){
      if(newVal.length){
        writeConfig({outputFilename: newVal})
      }
    }
  },
	methods: {
		/* 输出路径 */
		dragFinishHandler(files) {
			files = files.map(typify).filter((file) => file.isDir);

			if (files.length) {
				writeConfig({ outputPath: files[0].path }).then((res) => {
					this.outputPath = res.outputPath;
				});
			}
		},

		/**打开路径 */
		openPath(path) {
			path = path || this.outputPath;
			execPro(`open ${path}`);
		},

		/**输出路径 */
		changeOutputPath(e) {
			const outputFiles = Array.from(e.target.files);
			writeConfig({ outputPath: outputFiles[0].path }).then((res) => {
				this.outputPath = res.outputPath;
			});
		},

		changeTemplate() {},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

/* 输出模式 */
.com-output-mode {
	cursor: default;
	border: 2px dashed $blue;
	min-height: 120px;
	padding: 2em 1em;
	background-color: $white;

	.path-box,
	.name-box {
		@include flex-row(space-between, flex-start);

		.left,
		.right {
			min-height: 30px;
			line-height: 30px;
		}
		.left {
			width: 8.2em;
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
					cursor: pointer;
					font-size: $fontSize * 1;
					height: 1.22em;
					line-height: 1.22em;
					border-bottom: 1px solid $darkBlue;
				}
				.my-btn {
					width: 80px;
				}
			}

			.line.example {
				font-size: 12px;
				color: gray;
			}
		}
	}

	.name-box {
		margin-top: 8px;
	}
}
</style>
