import { store } from '../../../common/utils';

const Tinify = require('tinify');
let apiKey = (Tinify.key = store.get('apiKey'));
store.listenApiKey((curr) => {
	Tinify.key = apiKey = curr;
});

function getTinify() {
	if (apiKey && apiKey.length === 32) {
		return Tinify;
	} else {
		return null;
	}
}
/**
 * 重写验证方法
 */
function validate() {
	return new Promise((res, rej) => {
		Tinify.validate(function(err) {
			if (err) {
				rej(err);
			} else {
				res(true);
			}
		});
	});
}

/**
 * 获取剩余次数
 */
function getCompressionCount() {
	if (typeof Tinify.compressionCount === 'number') {
		return Promise.resolve(Tinify.compressionCount);
	} else {
		return validate().then((isNormal) => {
			if (typeof Tinify.compressionCount === 'number') {
				return Tinify.compressionCount;
			} else {
				return Promise.reject({ msg: `Tinify.compressionCount错误 ${Tinify.compressionCount}` });
			}
		});
	}
}

export { Tinify, getTinify, validate, getCompressionCount };
