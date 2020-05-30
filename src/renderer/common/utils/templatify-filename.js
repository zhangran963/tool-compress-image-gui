/* 前部分补0 */
const addZero = (num) => (parseInt(num) < 10 ? '0' + num : num);
/**
 * 名称模板
 * ${name}: 名称
 * ${date}: 日期, 20200217
 * ${time}: 时间, 12:00
 * ${index}: 索引, 1
 * @param {string} pattern 包含标识的模板
 * @param {string} name 原名称
 */
export function templatifyFilename(pattern = '', index = 0, name = '') {
	let varItems = pattern.match(/\{([a-zA-Z]+)\}/g) || [];

	const date = new Date();
	let paramBox = {
		index: parseInt(index)+1,
		name,
		date: `${date.getFullYear()}${addZero(date.getMonth() + 1)}${addZero(date.getDate())}`,
		time: `${addZero(date.getHours())}${addZero(date.getMinutes())}`, /* 文件名称不能包含':' */
	};
	let res = varItems.reduce((prev, key) => {
		let innerKey = key.slice(1, -1);
		let value = paramBox[innerKey] || '';
		return prev.replace(key, value);
	}, pattern);

	return res;
}
