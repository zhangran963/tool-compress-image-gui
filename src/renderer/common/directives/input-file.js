/**
 * 使用方式
 */
{/* <input
	type='file'
	class='hidden'
	id='file-input'
	accept='image/png, image/jpeg, image/jpg'
	v-input-file='receiveHandler'
/>; */}

export default {
	bind() {
		/* 调用1次, 绑定到元素时调用 */
	},
	inserted: function(el, info, VNode) {
		/* DOM, info: {expression:键, value: 值, name: '名称', modifiers: {描述符: true}}, VNode */
		const { value: finishHandler = () => {} } = info;

		el.addEventListener('change', (e) => {
			let filteredFiles = Array.from(e.target.files).map((file) => {
				/* 需解析, 否则是 [object File] 类型 */
				const { name, path, type, size, lastModified, lastModifiedDate } = file;
				return { name, path, type, size, lastModified, lastModifiedDate };
			});

			/* 自定义事件 inputFinish */
			let mineEvent = new CustomEvent('inputFinish', { detail: filteredFiles });
			el.dispatchEvent(mineEvent);
			typeof finishHandler === 'function' && finishHandler(filteredFiles);
		});
	},
	update() {},
	componentUpdated() {},
	unbind() {},
};
//
