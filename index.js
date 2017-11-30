const electron = require('electron'), { app, BrowserWindow, ipcMain, globalShortcut, dialog, Menu } = electron;
const os = require('os');
const url = require('url');
const fs = require('fs-extra');
const path = require('path');
const { machineIdSync } = require('node-machine-id');
const ini = require('ini');
const async = require('async');
const machineId = machineIdSync({ original: true }), machineHash = machineIdSync();
const crypto = require('crypto'),
	algo = 'aes-256-ctr',
	settingsPassword = machineHash;

const srcDir = 'file:///' + __dirname;
const assetsDir = `${srcDir}/assets`;
const templatesDir = `${srcDir}/templates`;

const programFiles = process.env.hasOwnProperty('ProgramFiles(x86)') ? process.env['ProgramFiles(x86)'] : process.env['ProgramFiles']
,		homeDir = path.join(os.homedir(), 'AppData', 'Local')
,		companyDir = path.join(programFiles, 'Caprine Softworks')
,		projectDir = path.join(companyDir, 'JPEGoat')
,		configDir = path.join(projectDir, 'config')
,		userConfigDir = path.join(configDir, machineId)
,		dataDir = path.join(projectDir, 'data')
,		tmpDir = path.join(projectDir, 'tmp')
,		userConfigFile = path.join(userConfigDir, 'settings.ini')
,		defaultOutput = path.join(app.getPath('pictures'), 'JPEGoat')
,		defaultConfig = {
			app: {
				locale: 'en',
				outputPath: defaultOutput,
				imgur: {
					enabled: false,
					username: null,
					password: null,
					client: null,
					album: null
				}
			}
}

let clientConfig;

let splashScreen;			//	Splash screen
let mainWindow;			//	Main window

const initializer = () => {
	async.waterfall([
		createSplash,
		createDirs,
		checkConfig,
		loadConfig,
		loadMain,
		destroySplash
	], (err) => {
		if (err) console.trace(err);
		mainWindow.show();

		mainWindow.on('close', () => {
			app.quit();
		});
	});
};



/*
|--------------------------------------------------------------------------
|	Startup functions
|--------------------------------------------------------------------------
*/
const loadMain = (cb) => {
	console.log('Loading main window...');
	mainWindow = new BrowserWindow({
		minWidth: 720,
		minHeight: 480,
		frame: false,
		show: false
	});
	mainWindow.loadURL(`${templatesDir}/main.html`);

	mainWindow.on('ready-to-show', () => {
		cb(null);
	});
};
const createSplash = (cb) => {
	console.log('Creating splash screen...');
	splashScreen = new BrowserWindow({
		width: 300,
		height: 350,
		frame: false,
		minimizable: false,
		maximizable: false,
		show: false
	});
	splashScreen.loadURL(`${templatesDir}/splashScreen.html`);

	splashScreen.on('ready-to-show', () => {
		console.log('Splash screen loaded!');
		splashScreen.show();
		cb(null);
	});
};
const createDirs = (cb) => {
	console.log('Checking required directories...');
	let requiredDirs = [
		companyDir,
		projectDir,
		configDir,
		userConfigDir,
		dataDir,
		tmpDir,
		defaultOutput
	];
	requiredDirs.forEach(dir => {
		if (!fs.existsSync(dir)) {
			console.log(`Required directory [${dir}] does not exist, attempting to create`);
			fs.mkdirSync(dir);
		} else {
			console.log(`Found required directory [${dir}]!`);
		}
	});

	cb(null);
};
const checkConfig = (cb) => {
	console.log('Starting config creator...');
	let configFile = userConfigFile;
	if (fs.existsSync(configFile)) {
		console.log('Config file is present');
	} else {
		console.log('Wrote default config');
		fs.writeFileSync(configFile, ini.stringify(defaultConfig));
	}

	cb(null);
};
const loadConfig = (cb) => {
	console.log('Loading client config...');
	clientConfig = ini.parse(fs.readFileSync(userConfigFile, 'utf-8'));
	cb(null);
};
const destroySplash = (cb) => {
	console.log('Destroying splash...');
	splashScreen.destroy();
	splashScreen = null;
	cb(null);
};
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Core app events
|--------------------------------------------------------------------------
*/
app.on('ready', initializer);
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	// if (process.platform !== 'darwin') {
	// 	app.quit(1);
	// }
	app.quit();
});
app.on('before-quit', () => {
	console.log('Caught [before-quit]');
	//TODO: any cleaning up that needs to be done
});
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Send any data to the renderer that it cannot obtain itself, such as the
|	config directory
|--------------------------------------------------------------------------
*/
ipcMain.on('request-client-data', (event, arg) => {
	if (arg) {
		console.log('Received client data request, sending client data to renderer');
		event.sender.send('requested-client-data', {
			dirs: {
				config: userConfigDir
			}
		});
	}
});
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Save config settings
|--------------------------------------------------------------------------
*/
ipcMain.on('save-settings', (event, arg) => {
	if (typeof arg === 'object') {
		fs.writeFile(path.join(configDir, 'client.ini'), ini.stringify(arg), 'utf-8', (err) => {
			if (err) alert(err);
			clientConfig = ini.parse(fs.readFileSync(path.join(configDir, 'client.ini'), 'utf-8'));
			console.log('Reloaded client config', clientConfig);
			event.sender.send('save-settings-success', true);
		});
	}
});
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Catch window control events from the renderer process
|--------------------------------------------------------------------------
*/
ipcMain.on('win.minimize', (event) => {
	BrowserWindow.fromId(mainWindow.id).minimize();	//	Use fromId() so we can specifically target a window
});
ipcMain.on('win.maximize', (event) => {
	let mw = BrowserWindow.fromId(mainWindow.id);
	if (mw.isMaximized()) mw.unmaximize();
	else mw.maximize();
});
ipcMain.on('win.close', (event) => {
	app.quit();
});
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Generic quit event, [arg] must be true
|--------------------------------------------------------------------------
*/
ipcMain.on('sys.quit', (event, arg) => {
	if (arg) app.quit();
});
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Log messages to the main process terminal from the renderer, mostly
|	useful for debugging as there is no terminal to see in the built binary
|--------------------------------------------------------------------------
*/
ipcMain.on('log', (event, msg) => {
	console.log('[Renderer]', msg);
});
/*
|---------------------------------------------------------------------------
*/



const appCrypt = {
	en: (data, algo, pass, cb) => {
		let cipher = crypto.createCipher(algo, pass);
		let encrypted = cipher.update(data, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		return cb(encrypted);
	},
	de: (data, algo, pass, cb) => {
		let decipher = crypto.createDecipher(algo, pass);
		let decrypted = decipher.update(data, 'base64', 'utf8');
		decrypted += decipher.final('utf8');
		return cb(decrypted);
	}
};