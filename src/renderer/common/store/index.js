import { sleep, camelize, emptyHandler, homeDir, fsExists, path } from '../utils';
const ElectronStore = require('electron-store');

const defOutPath = ''
const schema = {
	apiKey: {
		type: 'string',
		default: '',
		minLength: 0,
		maxLength: 32,
	},
	/* 处理模式 */
	modeIndex: {
		type: 'integer',
		default: 0,
		enum: [0, 1, 2, 3],
	},
	/* 输出路径 */
	outPath: {
		type: 'string',
		default: defOutPath,
		minLength: 0,
		maxLength: 100,
		// pattern: "[\/\w]", /* 字符串格式 */
	},
	/* 文件名模板 */
	filenameTemplate: {
		type: 'string',
		default: '{index}.{name}',
	},

	// percent: {
	// 	type: 'number',
	// 	default: 20,
	// 	multipleOf: 10 /* 整数倍 */,
	// 	exclusiveMaximum: 100 /* 无限接近但不等于 */,
	// },

	// dimension: {
	// 	type: 'object',
	// 	properties: {
	// 		aa: {
	// 			type: 'string',
	// 		},
	// 		num: {
	// 			type: 'number',
	// 		},
	// 	},
	// 	additionalProperties: false /* 禁止更多属性 */,
	// 	default: {
	// 		aa: 'aa',
	// 		num: 123,
	// 	},
	// 	propertyNames: {
	// 		pattern: '^[da-z]+$',
	// 	},
	// 	patternProperties: {
	// 		/* 不同格式的属性, 有不同的类型 */
	// 		'^S_': { type: 'string' },
	// 		'^I_': { type: 'integer' },
	// 	},
	// 	required: ['num'],
	// 	minProperties: 2 /* 属性个数 */,
	// 	maxProperties: 10 /* 属性个数 */,
	// },

	// tags: {
	// 	description: 'Tags for the product',
	// 	type: 'array',
	// 	default: ['temp'],
	// 	items: {
	// 		/* 子项: 全部符合 */
	// 		type: 'string',
	// 	},
	// 	// contains: { /* 子项: 部分符合 */
	// 	//   type: "number"
	// 	// },
	// 	// minItems: 1, /* 长度 */
	// 	uniqueItems: true /* 每一个item都是唯一的 */,
	// },

	// isShow: {
	// 	type: 'boolean',
	// },
	// isNull: {
	// 	type: 'null',
	// },
};

let store = new ElectronStore({ schema, required: ['file'] });
/* 拓展set函数, 使支持Promise */
store.__set = store.set;
store.set = (...args) => {
	try {
		store.__set(...args);
		const [key = ''] = args;
		return sleep(0, key ? store.get(key) : null);
	} catch (err) {
		console.error('报错信息: ', err.message);
		return Promise.reject(err);
	}
};

/* 给每个参数都添加 onDidChange事件, 并改为 listen[首字母大写的键] */
Object.keys(schema).forEach((key) => {
	store[`${camelize(`listen-${key}`)}`] = (callback = emptyHandler) => {
    const unSubscribe = store.onDidChange(key, callback);
    /* 解除绑定, 一般用于 beforeDestroy 周期中, store.listenXXX.unSubscribe() */
    store[`${camelize(`listen-${key}`)}`]['unSubscribe'] = unSubscribe
	};
});


/* 输出 */
export {
	store,
};


/* 默认输出路径: ~/Desktop; 其次是 ~ */
const desktopDir = path.resolve(homeDir, 'Desktop')
if(store.get('outPath') === defOutPath){
  fsExists(desktopDir).then(has => {
    if(has){
      store.set('outPath', desktopDir)
    }else{
      store.set('outPath', homeDir)
    }
  })
}