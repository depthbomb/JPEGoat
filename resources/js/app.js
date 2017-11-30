const electron = require('electron');
const { ipcRenderer, remote } = electron;
const { app, dialog } = electron.remote;

const fs = require('fs');
const path = require('path');

const $ = require('jquery-slim');
const m = require('mithril');
const moment = require('moment');
const ini = require('ini');

const build = require('../build-info.json');

let rendererConfig;

import { Index } from '../assets/js/components/views/Index.js';
import { Settings } from '../assets/js/components/views/Settings.js';
import { AppSettings } from '../assets/js/components/views/settings/_App.js';
import { ImgurSettings } from '../assets/js/components/views/settings/_Imgur.js';


m.route(document.body, '/', {
	'/': Index,
	'/settings': Settings,
	'/settings/app': AppSettings,
	'/settings/imgur': ImgurSettings
});


/**
* Request some client data from the main process and set the {client}
*/
ipcRenderer.send('request-client-data', true);
ipcRenderer.on('requested-client-data', (event, data) => {
	console.log('Received data from main process', data);
	if (typeof data !== 'object') alert('There was a problem processing your client settings. Please see %LINK HERE% for steps on troublehsooting this problem.');
	rendererConfig = data;
});


/**
* Save settings and redirect to main screen
*/
ipcRenderer.on('save-settings-success', (event, data) => {
	if (data) {
		dialog.showMessageBox({
			type: 'info',
			title: 'Success',
			message: 'Your settings have been saved!'
		});
		document.location.href = '#!/';
	}
});


/**
* TODO
*/
ipcRenderer.on('image-processing', (event) => {
	document.querySelector('.input-trigger').classList.add('disabled');
});
ipcRenderer.on('image-processing-success', (event) => {
	document.querySelector('.input-trigger').classList.remove('disabled');
	remote.dialog.showMessageBox({
		type: 'info',
		title: 'Success',
		message: 'Image successfully JPEG-ified!'
	});
});