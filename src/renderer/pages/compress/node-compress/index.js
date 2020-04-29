const path = require('path');
const os = require('os')
const { Tinify } = require('./Tinify');

module.exports = function compress(fullPath) {
	let extname = path.extname(fullPath);
  let basename = path.basename(fullPath).replace(extname, ''); /* 文件名(不含格式) */
  
  const outputFullname = path.resolve(os.homedir(), 'Desktop', basename) + extname
	/* 输出文件名 */
	// basename = filenameTemplate(outputFilename, index, basename) + extname;

	/* 输出文件路径 */
	// const outputFullname = path.resolve(outputPath, basename);
	// /* 动画开始 */
	// // let spinner = Spinner.start(`压缩中: ${fullPath}`);
	return Tinify.fromFile(fullPath)
    .toFile(outputFullname)
    .then(res => ({inputFullname: fullPath, outputFullname, basename, extname}))
		// .catch(console.log);
};
