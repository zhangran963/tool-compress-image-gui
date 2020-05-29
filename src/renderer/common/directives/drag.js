import { isDefObj, emptyHandler } from '../utils/index';

const decodeDirectiveAll = (info) => {
	const { value: params, modifiers: { file: modifierFile = false, dir: modifierDir = false } = {} } = info;

	/* 兼容处理: 函数|对象{isFile, isDirectionary, handler}, 或 v-drag.file.dir="handler" */
	let dragFinishHandler = emptyHandler,
		isFile = false,
		isDir = false;
	if (isDefObj(params)) {
		const { handler = emptyHandler, isFile: paramsIsFile = false, isDir: paramsIsDir = false } = params;

		dragFinishHandler = handler;
		isFile = [paramsIsFile, modifierFile].includes(true);
		isDir = [paramsIsDir, modifierDir].includes(true);
	} else if (typeof params === 'function') {
    dragFinishHandler = params;
    isFile = [modifierFile].includes(true);
		isDir = [modifierDir].includes(true);
	}

	return { isFile, isDir, dragFinishHandler };
};

export default {
	bind() {
		/* 调用1次, 绑定到元素时调用 */
	},
	inserted: function(el, info, VNode) {
		/* DOM, info: {expression:键, value: 值, name: '名称', modifiers: {描述符: true}}, VNode */
    let { isFile, isDir, dragFinishHandler } = decodeDirectiveAll(info);
    // console.log('* ', isFile, isDir)

		/* 释放 */
		el.addEventListener('drop', (e) => {
			e.preventDefault();

			let { dataTransfer } = event;
			const files = dataTransfer.files;

			const dealFiles = Array.from(files).map((file) => {
        /* 需解析, 否则是 [object File] 类型 */
				const { name, path, type, size, lastModified, lastModifiedDate } = file;
				return { name, path, type, size, lastModified, lastModifiedDate };
      });


			/* 自定义事件 dragFinish */
			let mineEvent = new CustomEvent('dragFinish', { detail: dealFiles });
			el.dispatchEvent(mineEvent);
			typeof dragFinishHandler === 'function' && dragFinishHandler(dealFiles);
		});

		/* 移到 ... 之上 */
		el.addEventListener('dragover', (e) => {
			e.preventDefault();

			let { dataTransfer } = e;
			let items = Array.from(dataTransfer.items).map(({ kind, type }) => {
				return { kind, type, isBlurFile: Boolean(type), isBlurDir: !Boolean(type) };
      });
      /* 过滤 文件/文件夹 */
      if(isFile && isDir){

      }else if(isFile && !isDir){
        items = items.filter(item => item.isBlurFile)
      }else if(!isFile && isDir){
        items = items.filter(item => item.isBlurDir)
      }else{
        items = []
      }


      // el.style.cursor = items.length > 0 ? 'copy': 'no-drop';
      
		});
	},
	update() {},
	componentUpdated() {},
	unbind() {},
};
//
