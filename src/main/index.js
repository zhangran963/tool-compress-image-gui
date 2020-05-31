import { app, BrowserWindow, ipcMain, Menu } from 'electron';

const isDev = process.env.NODE_ENV === 'development';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path')
		.join(__dirname, '/static')
		.replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

function createWindow() {
	/* 隐藏 */
	Menu.setApplicationMenu(null);
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		width: 600,
		height: isDev ? 1400 : 500,
		useContentSize: true,
		webPreferences: {
			nodeIntegration: true /* 支持渲染进程中使用clipboard模块等 */,
		},
	});

	/* 暂定生产模式, 也会开启开发者工具, 方便调试 */
	// mainWindow.webContents.openDevTools();

	mainWindow.loadURL(winURL);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	/* start: 修复再Mac中, 不支持粘贴的问题 */
	if (process.platform === 'darwin') {
		const template = [
			{
				label: 'Application',
				submenu: [
					{
						label: 'Quit',
						accelerator: 'Command+Q',
						click: function() {
							app.quit();
						},
					},
				],
			},
			{
				label: 'Edit',
				submenu: [
					{ label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
					{ label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
					{
						label: '全选',
						accelerator: 'CmdOrCtrl+A',
						role: 'selectall',
					},
					{
						label: '撤销',
						accelerator: 'CmdOrCtrl+Z',
						role: 'undo',
					},
					{
						label: '剪切',
						accelerator: 'CmdOrCtrl+X',
						role: 'cut',
					},
				],
			},
		];
		Menu.setApplicationMenu(Menu.buildFromTemplate(template));
	} else {
		Menu.setApplicationMenu(null);
	}
	/* end: 修复再Mac中, 不支持粘贴的问题 */
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

/**
 * 主进程: 接受消息
 */
ipcMain.on('newMsg', (e, arg) => {
	console.log('* arg', arg);
	// console.log('* e', e, arg)
});
