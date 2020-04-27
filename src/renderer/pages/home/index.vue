<template>
	<div class="page-home">
		<p>homepage</p>

		<input type="text" v-model="msg" />
		<button @click="sendMessage">发送消息</button>
		<p class="result" draggable="true" @dragstart="event.dataTransfer.setData('text/plain', null)">{{ res }}</p>
		<!-- <a
			href="#"
			class="drag-box"
			@drag="dragHandler"
			@dragstart="dragHandler"
			@dragenter="dragHandler"
			@dragover="dragHandler"
			>拖动</a
		> -->

		<hr />
		<div class="drag-box">
			<p class="text" draggable="true" @dragstart.capture="dragTextStart" @drop.capture="dropText">我是被拖动的文本</p>
			<div class="box box1" @dragenter.capture="dragBoxEnter" @dragleave.capture="dragBoxLeave" @drop.capture="dropBox"></div>
			<div class="box box2" @dragenter.capture="dragBoxEnter" @dragleave.capture="dragBoxLeave" @drop.capture="dropBox"></div>
			<div class="box box3" @dragenter.capture="dragBoxEnter" @dragleave.capture="dragBoxLeave" @drop.capture="dropBox"></div>
		</div>
	</div>
</template>

<script>
import { ipcRenderer, remote } from 'electron';
const path = require('path');

/* 注: 这样写, 引起asar相关错误 */
// let Node = remote.require(path.resolve(__dirname, './nodess.js'))

export default {
	data(vm) {
		return {
			msg: '默认消息',
			res: '',
		};
	},
	created() {
		// console.log('* BrowserWindow', remote.BrowserWindow);
		// console.log('* node path', path.resolve(__dirname, 'list'));
		// let newWindow = new remote.BrowserWindow({
		//   height: 640,
		// 	useContentSize: true,
		// 	width: 550,
		// 	frame: false,
		// 	// parent: mainWindow,
		// 	// icon: path.resolve(__static, 'icon.ico')
		// });
		// newWindow.loadURL('https://github.com')
    // console.log('* home created', newWindow);
    
    // document.addEventListener('drop', e => {
    //   console.log('* drop ducument', e)
    // }, false)
  },
  mounted(){
    this.$router.push('/drag')
  },
	methods: {
		/**
		 * 渲染进程: 发送消息
		 */
		sendMessage(info = {}) {
			this.res = this.msg;
			console.log('结果: ', this.res);

			// const res = Node.getPath(info)
			// this.res = res
			// ipcRenderer.send('newMsg', info);
		},
		dragHandler(e) {
			console.log('* 类型', e.type);
			if (e.type === 'drag') {
				// console.log('* drag: ', e)
			} else if (e.type === 'dragenter') {
				console.log('* dragenter: ', e);
			} else if (e.type === 'dragover') {
				console.log('* dragover', e);
			}
    },
    
    dragTextStart(e){
      console.log('* e', e.currentTarget)
      this.dragTarget = e.currentTarget
    },
    dropText(e){
      console.log('* dropText', e)
    },
    dragBoxOver(e){
      e.currentTarget.style.opacity = 0.5
    },
    dragBoxEnter(e){
      e.currentTarget.style.opacity = 0.5
    },
    dragBoxLeave(e){
      e.currentTarget.style.opacity = ''
    },
    dropBox(e){
      console.log('* dropBOx', e)
      // e.preventDefault()
      this.dragTarget.parentNode.removeChild(this.dragTarget)
      e.currentTarget.style.opacity = ''
      e.currentTarget.appendChild(this.dragTarget)
    }
	},
};
</script>

<style lang="scss" scoped>
.drag-box{
  width: 100%;
  height: 200px;
  .text{
    display: inline-block;
    padding: 0.5em 1em;
    background-color: lightgoldenrodyellow;
    color: darkolivegreen;
    border: 1px solid darkolivegreen;
    margin: 10px;
  }
  .box{
    width: 200px;
    height: 3em;
    background-color: darkcyan;
    margin: 10px;
  }
}

// .drag-box {
// 	border: 1px solid goldenrod;
// 	display: inline-block;
// 	width: 100px;
// 	height: 80px;
// }
</style>
