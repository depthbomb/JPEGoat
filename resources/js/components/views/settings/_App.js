import { Layout } from '../_Layout';
saveAppSettings = () => {
	let appSettings = {
		previousConversions: document.getElementById('previous-conversions').value,
		outputPath: document.getElementById('output-path').value,
		locale: 'en',
		useWinUi: 'no',
		disableUpdateDialog: document.getElementById('show-update-dialog').checked ? 'yes' : 'no'
	}

	ipcRenderer.send('save-settings', { section: 'app', data: appSettings });
}
exports.AppSettings = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'App Settings';
		clientConfig.app.disableUpdateDialog === 'yes'
			? document.getElementById('show-update-dialog').checked = true
			: document.getElementById('show-update-dialog').checked = false;
	},
	view: (vnode) => {
		return m(Layout, [
			m("h2.text-light.mb-3", "App Settings"),
			m(".form-group.text-light", [
				m("label", "Output folder"),
				m(`input.form-control#output-path[type='text'][value='${clientConfig.app.outputPath}']`),
				m("small.form-text", "The path to the folder that the converted image will be saved to.")
			]),

			m(".form-group.text-light", [
				m("label", "Previous conversions to display", m('span.text-danger', ' [Unavailable]')),
				m(`input.form-control#previous-conversions[type='text'][value='${clientConfig.app.previousConversions}']`),
				m("small.form-text", "Number of previous conversions to display on the main page. Very large numbers could cause performance problems in the application.")
			]),

			m(".form-group.text-light", [
				m("span.switch.switch-sm", [
					m("input.switch#show-update-dialog[type='checkbox']"),
					m("label[for='show-update-dialog']", "Show update dialog on app boot")
				]),
				m('p', 'Disabling this will prevent the update dialog from appearing on boot when there is a new app version available.')
			]),

			m(".form-group", [
				m('button[type="button"].btn.btn-primary', { onclick: e => saveAppSettings() }, [
					m('span.icon.icon-content-save'),
					' Save'
				]),
				m('button[type="button"].btn.btn-warning.btn-sm.ml-2', { onclick: e => ipcRenderer.send('open-config-file') }, [
					m('span.icon.icon-file-document'),
					' Edit manually'
				])
			])
		])
	}
}