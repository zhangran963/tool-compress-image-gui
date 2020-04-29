<template>
	<van-popup v-model="selfShow" :closeable="true" @close="close">
		<div class="modal-change-template">
			<h4 class="title">输出文件名模板</h4>
			<ul class="items">
				<li><span>{name}：</span>原始文件名</li>
				<li><span>{date}：</span>日期，如 "20200501"</li>
				<li><span>{time}：</span>时间，如 "12:07"</li>
				<li><span>{index}：</span>压缩过程中的索引值，由1开始</li>
			</ul>
			<div class="input-box">
				<input class="input" type="text" maxlength="30" v-model="newTemplate" />
				<span class="preview">{{ previewStr }}</span>
			</div>

			<div class="my-btn" @click="update">保存</div>
		</div>
	</van-popup>
</template>

<script>
const defTemplate = '{name}';

const defName = '我是文件名',
	defDate = '20200501',
	defTime = '12:55',
	defIndex = '1';
export default {
	props: ['show'],
	data: () => ({
    selfShow: false,
		newTemplate: '',

		previewStr: '',
	}),
	watch: {
		show(currShow) {
			if (currShow) {
        this.selfShow = true
				this.newTemplate = defTemplate;
			}else{
        this.selfShow = false
      }
		},
		newTemplate(currTemplate) {
			/* 预览模板 */
			this.previewStr = currTemplate
				.replace('{name}', defName)
				.replace('{date}', defDate)
				.replace('{time}', defTime)
				.replace('{index}', defIndex);
		},
	},
	methods: {
		update() {
			const newTemplate = this.newTemplate;
			if (newTemplate.length === 0) {
        this.$notify.danger('请填写模板')
			} else {
				this.$emit('update', this.newTemplate);
				this.close();
			}
		},
		close() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.modal-change-template {
	width: 360px;
	padding: 30px 24px 20px;
	background-color: $white;
	border-radius: $borderRadiusLarge;
	box-sizing: border-box;

	@include flex-col(flex-start, stretch);

	.title {
		margin: 0;
		padding: 0;
		text-align: center;
	}
	.items {
		font-size: $fontSize * 0.92;
		color: #666;
		margin: 20px auto;
		li > span {
			display: inline-block;
			width: 4em;
			text-align: right;
		}
	}
	.input-box {
		@include flex-col(flex-start, stretch);
		width: 90%;
		margin: 0 auto 20px;

		.input {
			width: 100%;
			padding: 0.4em 10px;
			background-color: $gray;
			font-size: $fontSize * 1.1;
			border-radius: $borderRadiusSmall;
		}
		.preview {
			padding: 0 10px;
			font-size: $fontSize * 0.9;
			height: 20px;
		}
	}

	.my-btn {
		align-self: center;
		font-size: $fontSize * 1.1;
		min-width: 3em;
		white-space: nowrap;
	}
}
</style>
