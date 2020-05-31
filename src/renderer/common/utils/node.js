const { promisify } = require('util');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const Path = require('path')

export const fsExists = promisify(fs.exists);
export const fsReadFile = promisify(fs.readFile);
export const fsWriteFile = promisify(fs.writeFile);
export const fsStat = promisify(fs.stat);
export const fsUnlink = promisify(fs.unlink)

/**
 * 执行命令
 */
export const execPro = promisify(exec);

/**
 * 给(单项)读取的文件属性添加属性
 * @param {object} file
 */
export const typify = (file) => {
  const { name, path, type, size } = file;
  /* 路径,格式 */
  const {dir, ext} = Path.parse(path)

	/* 处理文件(夹)属性 */
	const stat = fs.statSync(path);
	const mode = (stat.mode & parseInt('777', 8)).toString(8);
	const isDir = stat.isDirectory();
	const isFile = stat.isFile();

	return Object.assign(file, { mode, isDir, isFile, dir, ext });
};

export const homeDir = os.homedir();

export const path = require('path');
