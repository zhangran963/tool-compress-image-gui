<template>
	<div class="com-body-base64" v-drag.file="receiveHandler">
		<template v-if="base64.length === 0">
			<div class="content empty">
				<!-- 提示 -->
				<p class="placeholder">可拖放文件到这里</p>
			</div>
			<div class="btns-box">
				<label for="file-input" class="my-btn add" v-if="status === null">添加</label>
				<van-button type="primary" class="my-btn add" v-else loading loading-text="处理中"></van-button>
			</div>
		</template>

		<template v-else>
			<!-- 输出格式按钮区 -->
			<div class="output-format-btn-box">
				<button
					class="my-btn"
					:class="checkIndex === i ? 'checked' : ''"
					v-for="(item, i) of base64Items"
					:key="i"
					@click="checkIndex = i"
				>
					{{ item.btnText }}
				</button>
			</div>
			<!-- 文本内容 -->
			<div class="content" :style="{ 'background-image': `url(${base64Items[0].content})` }">
				{{ base64Item.content }}
			</div>
			<div class="btns-box">
				<van-button type="primary" class="my-btn reset" @click="resetHandler">重置</van-button>
				<!-- <van-button type="primary" class="my-btn copy" @click="copyHandler()">复制</van-button> -->
			</div>
		</template>

		<!-- 选择图片用input -->
		<input
			v-if="status === null"
			type="file"
			class="hidden"
			id="file-input"
			accept="image/png, image/jpeg, image/jpg"
			v-input-file="receiveHandler"
		/>
	</div>
</template>

<script>
import { compress } from "../node-compress/index";
import { base64ify } from "../node-base64ify/index";
import { clipboard } from 'electron';
import { typify, execPro, store, fsUnlink } from '../../../common/utils/index';

export default {
	data: () => ({
		file: null,
		status: null /* 未压缩: null; 压缩中: true; 压缩出错: false */,
		base64: '',
		checkIndex: 0,
	}),
	created() {
		/* 监听 */
		store.listenModeIndex((curr, prev) => {
			/* 重置 */
			this.file = null;
			this.status = null;
			this.base64 = '';
		});
	},
	computed: {
		/* base64项列表 */
		base64Items() {
			return ['data:image/jpg;base64,[base64]', "background-image: url('data:image/jpg;base64,[base64]');"].map(
				(template) => {
					return {
						btnText: template.replace('[base64]', this.base64.slice(0, 5)+'...'),
						content: template.replace('[base64]', this.base64),
					};
				}
			);
		},
		/* 选中的项 */
		base64Item() {
			return typeof this.checkIndex === 'number' ? this.base64Items[this.checkIndex] : null;
		},
	},
	watch: {
		base64(curr) {
			this.checkIndex = typeof curr === 'string' && curr.length ? 0 : null;
		},
		/* 监听选中项, 并复制到剪切板 */
		base64Item(str) {
			this.copyHandler();
		},
	},
	methods: {
		/* 拖放元素 */
		receiveHandler(newFiles) {
			newFiles = newFiles.map((file) => typify(file));
			if (newFiles.length) {
				this.file = newFiles[0];

				/* 压缩 并 导出 */
				this.status = true;
				if (store.get('modeIndex') === 2) {
					compress(this.file.path)
						.then((outFullPath) => {
              /* 更新剩余压缩次数 */
              this.$bus.emit('refresh') 
              /* base64化 */
							return Promise.all([outFullPath, base64ify(outFullPath)]);
						})
						.then(([outFullPath, str]) => {
							this.base64 = str;
							this.status = null;
              /* 删除临时文件 */
							fsUnlink(outFullPath); 
						})
						.catch((err) => {
							this.status = false;
						});
				} else {
					base64ify(this.file.path)
						.then((str) => {
							this.base64 = str;
							this.status = null;
						})
						.catch((err) => {
							this.status = false;
						});
				}
			}
		},

		/* 重置 */
		resetHandler() {
			this.base64 = '';
			this.status = null;
		},

		/* 剪切板 */
		copyHandler(str) {
			if (!str) {
				str = this.base64Item ? this.base64Item.content : '';
			}
			if (str) {
				str && clipboard.writeText(str);
				this.$notify.success(`已复制到剪切板`);
			}
		},
  },
  beforeDestroy(){
    store.listenModeIndex.unSubscribe()
  }
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.com-body-base64 {
	@include flex-col(flex-start, stretch);
	.output-format-btn-box {
		width: 100%;
		@include flex-row(flex-start, center);
		.my-btn {
			border-radius: 0;
			&.checked {
				background-color: $darkBlue;
				color: $white;
			}
			$borderRadius: 2px;
			&:first-child {
				border-top-left-radius: $borderRadius;
				border-bottom-left-radius: $borderRadius;
			}
			&:last-child {
				border-top-right-radius: $borderRadius;
				border-bottom-right-radius: $borderRadius;
			}
		}
	}
	/**有内容 */
	.content {
		flex: 1;
		color: rgba(0, 0, 0, 0.15);
		padding: 6px 10px;
		text-align: justify;
		overflow: hidden;
		word-break: break-all;
		// background-color: #f2f2f2;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	/**空  */
	.content.empty {
		@include flex-col(center, center);
		.placeholder {
      margin-top: -2em;
			@include flex-col(center, center);
			color: darkgray;
		}
  }
  
  $btnsBoxHeight: 50px;
  $halfTransparent1: rgba(255,255,255,0.3);
  $halfTransparent2: rgba(255,255,255,0.8);
	.btns-box {
    height: $btnsBoxHeight;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-image: linear-gradient(to bottom, transparent 0, $halfTransparent1 50%, $white 100%), linear-gradient(to bottom, transparent 0%, $halfTransparent2 50%, $white 100%);
		@include flex-row(center, center);

		.copy,
		.add,
		.reset {
			align-self: center;
			margin: 0 10px;
		}
	}
}
</style>
