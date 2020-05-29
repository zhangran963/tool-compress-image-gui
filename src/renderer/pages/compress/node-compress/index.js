const path = require('path');
const os = require('os')
const { Tinify } = require('./Tinify');

module.exports = function compress(inFullPath, outFullPath) {
  if(typeof outFullPath !== 'string'){
    let extname = path.extname(inFullPath).replace('.', ''); /* 文件格式 */
    outFullPath = path.resolve(os.homedir(), `temp.${extname}`)
  }
	/* 输出文件名 */
	return Tinify.fromFile(inFullPath)
    .toFile(outFullPath)
    .then(res => outFullPath)
};
