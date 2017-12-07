const pkg = require('./package.json');
const electron = require('electron'), { app, BrowserWindow, ipcMain, globalShortcut, dialog, Menu, shell } = electron;
const os = require('os');
const url = require('url');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const { machineIdSync } = require('node-machine-id');
const jimp = require('jimp');
const ini = require('ini');
const cuid = require('cuid');
const async = require('async');
const machineId = machineIdSync({ original: true }), machineHash = machineIdSync();
const crypto = require('crypto'),
	algo = 'aes-256-ctr',
	settingsPassword = machineHash;
const imgur = require('imgur');

const srcDir = 'file:///' + __dirname;
const assetsDir = `${srcDir}/assets`;
const templatesDir = `${srcDir}/templates`;

const programFiles = process.env.hasOwnProperty('ProgramFiles(x86)') ? process.env['ProgramFiles(x86)'] : process.env['ProgramFiles']
,	homeDir = path.join(os.homedir(), 'AppData', 'Local')
,	companyDir = path.join(programFiles, 'Caprine Softworks')
,	projectDir = path.join(companyDir, 'JPEGoat')
,	configDir = path.join(projectDir, 'config')
,	userConfigDir = path.join(configDir, machineId)
,	dataDir = path.join(projectDir, 'data')
,	userDataDir = path.join(dataDir, machineId)
,	tmpDir = path.join(projectDir, 'tmp')
,	userConfigFile = path.join(userConfigDir, 'settings.ini')
,	defaultOutput = path.join(app.getPath('pictures'), 'JPEGoat')
,	appBlack = '#212529'
,	defaultConfig = {
		app: {
			locale: 'en',
			previousConversions: 10,
			outputPath: defaultOutput,
			useWinUi: 'no'
		},
		imgur: {
			enabled: 'no',
			username: '',
			password: '',
			client: '',
			album: ''
		}
}

let clientConfig;

let splashScreen;			//	Splash screen
let mainWindow;			//	Main window

const initializer = () => {
	async.waterfall([
		createSplash,
		checkReleases,
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
		minWidth: 800,
		minHeight: 400,
		backgroundColor: appBlack,
		frame: false,
		useContentSize: true,
		show: false
	});
	mainWindow.loadURL(`${templatesDir}/main.html`);

	mainWindow.on('ready-to-show', () => {
		console.log('Main window loaded!');
		cb(null);
	});
};
const checkReleases = (cb) => {
	console.log('Checking for new version...');
	const apiUrl = "https://api.github.com/repos/depthbomb/JPEGoat/releases/latest";
	request({
		headers: {
			'User-Agent': `Baaa! JPEGoat v${pkg.version}`
		},
		uri: apiUrl,
		method: 'GET'
	}, (e, r, b) => {
		if (e) throw new Error (e);
		let data = JSON.parse(b);
		console.log('Got API data...');
		if (data.id > pkg.version) {
			console.log('New version available', data.id);
			dialog.showMessageBox({
				type: 'info',
				title: 'Update available',
				message: 'A new version of JPEGoat is available.',
				detail: `${pkg.version} -> ${data.tag_name}`,
				buttons: [
					'Go to download page',
					'Close'
				],
				cancelId: 1
			}, response => {
				if (response === 0) {
					shell.openExternal(data.html_url);
					app.quit();
					cb(null);
				} else {
					cb(null);
				}
			});
		} else {
			console.log('No new version available', data.id);
			cb(null);
		}
	});
};
const createSplash = (cb) => {
	console.log('Creating splash screen...');
	splashScreen = new BrowserWindow({
		width: 300,
		height: 350,
		frame: false,
		transparent: true,
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
		userDataDir,
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
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Open image picker dialog
|	TODO: cleanup
|--------------------------------------------------------------------------
*/
ipcMain.on('choose-image', (event) => {
	event.sender.send('update-progress', { success: true, status: 'Waiting...', progress: '1%' });
	event.sender.send('image-processing');
	let filters = [ { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'bmp'] } ];
	let properties = [ 'openFile' ];
	dialog.showOpenDialog({ filters, properties }, (files) => {
		if (files) {
			event.sender.send('update-progress', { success: true, status: 'Receiving file...', progress: '25%' });
			//	'files' is returned as an array since there is functionality
			//	to select multiple files (though unused here) so get the first
			//	item in the array.
			let image = files[0];
			jimp.read(image, (err, img) => {
				if (err) throw new Error(err);
				event.sender.send('update-progress', { success: true, status: 'Processing image...', progress: '75%' });
				let newFile = path.join(clientConfig.app.outputPath, `JPEGoat_${cuid()}.jpg`);	//..Create a path to the output file
				img.quality(1).dither565().write(newFile);

				if (clientConfig.imgur.enabled === 'yes') {
					//	If the user enables Imgur uploading
					event.sender.send('update-progress', { success: true, status: 'Uploading to Imgur...', progress: '85%' });
					imgur.setCredentials(
						clientConfig.imgur.username,
						clientConfig.imgur.password,
						clientConfig.imgur.client
					);

					imgur.uploadFile(newFile, clientConfig.imgur.album).then(json => {
						event.sender.send('update-progress', { success: true, status: 'Upload complete!', progress: '100%' });
						let data = json.data;

						dialog.showMessageBox({
							type: 'info',
							title: 'Upload successful',
							message: 'Your image has been successfully uploaded to your Imgur album.',
							detail: data.link,
							buttons: [
								'Open in browser',
								'Close'
							],
							cancelId: 1
						}, response => {
							if (response === 0) return shell.openExternal(data.link);
							event.sender.send('image-processing-complete');
							event.sender.send('update-progress', { success: true, complete: true });
						});
					}).catch(e => {
						//	Show a generic error dialog box with the error message from the Imgur API
						dialog.showMessageBox({
							type: 'error',
							title: 'Upload error',
							message: 'There was an error while uploading your image:\n' + e.message
						});
						event.sender.send('image-processing-complete');
						event.sender.send('update-progress', { success: true, complete: true });
					});
				} else {
					dialog.showMessageBox({
						type: 'info',
						title: 'Success',
						message: 'Image successfully JPEG-ified!',
						buttons: [
							'Open location',
							'Close'
						],
						cancelId: 1
					}, response => {
						if (response === 0) shell.showItemInFolder(newFile);
						event.sender.send('image-processing-complete');
						event.sender.send('update-progress', { success: true, complete: true });
					});
				}

				mainWindow.flashFrame(true);
				mainWindow.once('focus', () => mainWindow.flashFrame(false));
			});
		} else {
			//	If the user clicks 'cancel' then the file browser button will
			//	still be disabled, so send the renderer a message to activate it.
			event.sender.send('image-processing-complete');
			event.sender.send('update-progress', { success: true, complete: true });
		}
	});
})
/*
|---------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Sends {clientConfig} to the renderer process
|--------------------------------------------------------------------------
*/
ipcMain.on('request-client-config', (event) => {
	console.log('Received client data request, sending client data to renderer');
	event.sender.send('requested-client-config', clientConfig);
});
/*
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Save config settings
|--------------------------------------------------------------------------
*/
ipcMain.on('save-settings', (event, arg) => {
	const section = arg.section;
	const settings = arg.data;

	let stagingConfig = clientConfig;
	stagingConfig[section] = settings;

	fs.writeFile(userConfigFile, ini.stringify(stagingConfig), 'utf8', (err) => {
		if (err) throw new Error (err);
		clientConfig = ini.parse(fs.readFileSync(userConfigFile, 'utf-8'));
		
		event.sender.send('saved-settings', { settings: clientConfig, section });	//..Let the renderer know
	});
});
/*
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
|	Catch window control events from the renderer process
|--------------------------------------------------------------------------
*/
ipcMain.on('win.close', (event) => {
	app.quit();
});
/*
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
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