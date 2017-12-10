const path = require('path');
const electron = require('electron');
const { ipcRenderer, remote } = electron;
const { app, dialog, shell } = electron.remote;
const m = require('mithril');

const basePath = path.join(__dirname, '../');
const build = require('../build-info.json');

let clientConfig;
let settingsNavOpen = false;

import { Index } from '../assets/js/components/views/Index.js';
import { About } from '../assets/js/components/views/About.js';
import { AppSettings } from '../assets/js/components/views/settings/_App.js';
import { ImgurSettings } from '../assets/js/components/views/settings/_Imgur.js';

m.route(document.body, '/', {
	'/': Index,
	'/settings/app': AppSettings,
	'/settings/imgur': ImgurSettings,
	'/about': About
});

/*
|--------------------------------------------------------------------------
|	Request and receive client config
|--------------------------------------------------------------------------
*/
ipcRenderer.send('request-client-config');
ipcRenderer.on('requested-client-config', (event, data) => {
	if (typeof data !== 'object') alert('There was a problem processing your client settings. Please see %LINK HERE% for steps on troublehsooting this problem.');
	clientConfig = data;
});
ipcRenderer.on('saved-settings', (event, data) => {
	//	Set {clientConfig} to the new data
	clientConfig = data.settings;
	
	//	Change the route to the route we were just on so the new values will appear
	m.route.set('/settings/' + data.section, {success: true});
});
/*
|--------------------------------------------------------------------------
*/