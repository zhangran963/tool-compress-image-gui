import { store } from "../../../common/utils";



const Tinify = require('tinify');
Tinify.key = 'zq9bG1BlfSg7Kt6YHwyVqhhyVCK4JFfR';

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
			// console.log('* ', Tinify.compressionCount);
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

export { Tinify };
export default {
	validate,
	getCompressionCount,
};
