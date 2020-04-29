const ElectronStore = require('electron-store');

const schema = {
	// outputPath: {
	//   default: '/',
	//   type: 'string',
	//   format: 'url',
	// }
};
const store = new ElectronStore({ schema });

/* 默认配置 */

store.store = Object.assign(
	{
		apiKey: '',
		modeIndex: 0,
		outputPath: '/',
		filenameTemplate: '{name}',
	},
	store.get()
);

const storeProxy = new Proxy(store, {
	set(target, property, value) {
    // if(property === 'apiKey'){
    //   target.set(property, value)
    // }
    console.log('* set property: ', property, value)
    if(!target.hasOwnProperty(property)){
      /* 非自身属性 => 保存的属性 */
      return Reflect.set(property, value)
      // return target.set(property, value)
    }else{
      console.error('不能更改自身属性')
    }
    
  },
  get(target, key){
    if(!target.hasOwnProperty(key)){
      console.log('* read key1: ', key)
      return Reflect.get(target, key)
      // return target.get(key)
    }else if(property === 'store'){
      console.log('* read key2: ', key)
      // return store
    }
    // return target[property]
  }
});

/* 输出 */
export { 
  storeProxy as store,
  store as originStore
 };

export const storeEvent = {
	/* 事件: apiKey更改后 */
	onApiKey: (callback) => store.onDidChange('apiKeys', callback),
	/* 事件: 模式更改后 */
	onMode: (callback) => store.onDidChange('modeIndex', callback),
	/* 事件: 输出路径 */
	onOutputPath: (callback) => store.onDidChange('outputPath', callback),
	/* 事件: 名称模板 */
	onFilenameTemplate: (callback) => store.onDidChange('filenameTemplate', callback),
};
