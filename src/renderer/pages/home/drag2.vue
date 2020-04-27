<template>
	<div class="drag-container">
		<div class="dropzone">
			<div id="draggable" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
				可以拖放的元素
			</div>
		</div>
		<div class="dropzone main" @drop="dropHandler" @dragover="preventHandler">
			<p>这里可接受外部拖放的文件</p>
			<div v-if="file">
				<p>文件名: {{ file.name }}</p>
				<p>类型: {{ file.type }}</p>
				<p>路径: {{ file.path }}</p>
			</div>
		</div>
		<div class="dropzone" @drop="dropHandler" @dragover="preventHandler"></div>
		<div class="dropzone" @drop="dropHandler" @dragover="preventHandler"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			file: null,
		};
	},

	watch: {
		file: {
			handler(curr, prev) {
				console.log('* prevFile', prev);
				console.log('* currFile', curr);
			},
		},
	},
	mounted() {
		// let dragged;
		/* 拖放内容 */
		// document.addEventListener(
		// 	'drag',
		// 	function(event) {
		// 		let { dataTransfer } = event;
		// 		if (dataTransfer.items) {
		// 			Array.from(dataTransfer.items).forEach((item) => {
		// 				console.log('* item', item);
		// 			});
		// 		}
		// 	},
		// 	false
		// );
		// document.addEventListener(
		// 	'dragstart',
		// 	function(event) {
		// 		/* 拖放内容 */
		// 		dragged = event.target;
		// 		event.target.style.opacity = 0.1;
		// 	},
		// 	false
		// );
		// document.addEventListener(
		// 	'dragend',
		// 	function(event) {
		// 		/* 拖放内容 */
		// 		event.target.style.opacity = '';
		// 		let { dataTransfer } = event;
		// 		console.log('* drag', dataTransfer.items, dataTransfer.files);
		// 	},
		// 	false
		// );
		/* 放下目标节点时触发事件 */
		// document.addEventListener(
		// 	'dragover',
		// 	function(event) {
		// 		/* 阻止默认动作 */
		// 		event.preventDefault();
		// 	},
		// 	false
		// );
		// document.addEventListener(
		// 	'dragenter',
		// 	function(event) {
		// 		/* 目标盒子, 改变背景色 */
		// 		if (event.target.className == 'dropzone') {
		// 			event.target.style.background = 'purple';
		// 		}
		// 	},
		// 	false
		// );
		// document.addEventListener(
		// 	'dragleave',
		// 	function(event) {
		// 		/* 目标盒子, 重置背景色 */
		// 		if (event.target.className == 'dropzone') {
		// 			event.target.style.background = '';
		// 		}
		// 	},
		// 	false
		// );
		// document.addEventListener(
		// 	'drop',
		// 	function(event) {
		// 		/* 阻止默认动作（如打开一些元素的链接） */
		// 		event.preventDefault();
		// 		/* 目标盒子, 转移 拖放的DOM */
		// 		if (event.target.className == 'dropzone' && dragged) {
		// 			event.target.style.background = '';
		// 			dragged.parentNode.removeChild(dragged);
		// 			event.target.appendChild(dragged);
		// 		}
		// 	},
		// 	false
		// );
	},

	methods: {
		/* 外部拖放: 放下 */
		dropHandler(event) {
			event.preventDefault();

			let { dataTransfer } = event;
			const file = dataTransfer.files[0];
			const { name, path, type, size } = file;
			let res = { name, path, type, size };
			// console.log('* drag files', res);
			this.file = res;
		},

		/* 外部拖放: 阻止打开 */
		preventHandler(event) {
			/* 阻止默认动作 */
			event.preventDefault();
		},
	},
};
</script>

<style lang="scss" scoped>
#draggable {
	width: 200px;
	height: 20px;
	text-align: center;
	background: white;
}

.dropzone {
	width: 200px;
	height: 40px;
	background: blueviolet;
	margin-bottom: 10px;
	padding: 10px;

	&.main {
    width: 360px;
		height: 100px;
	}
}
</style>
