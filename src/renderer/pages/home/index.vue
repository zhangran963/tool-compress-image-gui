<template>
	<div class="page-home">
		<p>homepage</p>

		<input type="text" v-model="msg" />
		<button @click="sendMessage">发送消息</button>
    <p class="result">{{ res }}</p>
	</div>
</template>

<script>
import { ipcRenderer, remote } from 'electron';
const path = require('path')

/* 注: 这样写, 引起asar相关错误 */
// let Node = remote.require(path.resolve(__dirname, './nodess.js'))

export default {
	data(vm) {
		return {
      msg: '默认消息',
      res: ''
		};
	},
	created() {
    console.log('* BrowserWindow', remote.BrowserWindow)
    console.log('* node path', path.resolve(__dirname, 'list'))
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
	},
	methods: {
		/**
		 * 渲染进程: 发送消息
		 */
		sendMessage(info = {}) {
      info = this.msg;
      
      // const res = Node.getPath(info)
      // this.res = res
			console.log('结果: ', info);
			// ipcRenderer.send('newMsg', info);
		}
	}
};
</script>
