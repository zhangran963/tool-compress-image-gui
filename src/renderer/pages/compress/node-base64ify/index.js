const fs = require('fs');
const { promisify } = require('util');
const readFilePro = promisify(fs.readFile);

export function base64ify(imgPath) {
	return readFilePro(imgPath).then((bitmap) => {
		return Buffer.from(bitmap, 'binary').toString('base64');
	});
};
