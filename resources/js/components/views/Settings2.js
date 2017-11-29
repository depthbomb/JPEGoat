import { Layout } from './_Layout';

const saveSettings = () => {
	let settings = document.getElementById('user-settings').value;
	ipcRenderer.send('save-settings', ini.parse(settings));	//..Send the object to the main process
};

let userConfig;
exports.Settings2 = {
	oninit: () => {
		userConfig = ini.parse(fs.readFileSync(path.join(rendererConfig.dirs.config, 'client.ini'), 'utf-8'));
	},
	view: () => {
		return m(Layout, [
			m(".container-fluid", [
				m('.form-group', [
					m('textarea.form-control#user-settings', { 'rows': 12 }, ini.stringify(userConfig, null, 8))
				]),
				m('.form-group.mt-4.mb-0', [
					m('button.btn.btn-success', { onclick: () => saveSettings() }, 'Save'),
					m('span#status')
				])
			])
		])
	}
}