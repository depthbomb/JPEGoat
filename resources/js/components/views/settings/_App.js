import { Layout } from '../_Layout';
saveAppSettings = () => {
	let appSettings = {
		previousConversions: document.getElementById('previous-conversions').value,
		outputPath: document.getElementById('output-path').value,
		locale: 'en',
		useWinUi: 'no',
		disableUpdateDialog: document.getElementById('show-update-dialog').checked ? 'yes' : 'no',
		disableGoogleAnalytics: document.getElementById('disable-ga').checked ? 'yes' : 'no',
		minimizeToTray: document.getElementById('minimizeToTray').checked ? 'yes' : 'no'
	}

	ipcRenderer.send('save-settings', { section: 'app', data: appSettings });
}
exports.AppSettings = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'App Settings';
		clientConfig.app.disableUpdateDialog === 'yes'
			? document.getElementById('show-update-dialog').checked = true
			: document.getElementById('show-update-dialog').checked = false;
		clientConfig.app.minimizeToTray === 'yes'
			? document.getElementById('minimizeToTray').checked = true
			: document.getElementById('minimizeToTray').checked = false;
		clientConfig.app.disableGoogleAnalytics === 'yes'
			? document.getElementById('disable-ga').checked = true
			: document.getElementById('disable-ga').checked = false;
	},
	view: () => {
		return m(Layout, [
			m("h2.mb-3", "App Settings"),
			m(".form-group", [
				m("label", "Output folder"),
				m(`input.form-control#output-path[type='text'][value='${clientConfig.app.outputPath}']`),
				m("small.form-text", "The path to the folder that the converted image will be saved to.")
			]),

			m(".form-group", [
				m("label", "Previous conversions to display", m('span.text-danger', ' [Unavailable]')),
				m(`input.form-control#previous-conversions[type='text'][value='${clientConfig.app.previousConversions}']`),
				m("small.form-text", "Number of previous conversions to display on the main page. Very large numbers could cause performance problems in the application.")
			]),

			m(".form-group", [
				m("span.switch.switch-sm", [
					m("input.switch#show-update-dialog[type='checkbox']"),
					m("label[for='show-update-dialog']", "Disable update dialog on app boot")
				]),
				m('small.form-text', 'Disabling this will prevent the update dialog from appearing on boot when there is a new app version available. You will still be able to see if there is a new version of the app available in the app\'s About page.')
			]),

			m(".form-group", [
				m("span.switch.switch-sm", [
					m("input.switch#minimizeToTray[type='checkbox']"),
					m("label[for='minimizeToTray']", "Minimize app to tray")
				])
			]),

			m(".form-group", [
				m("span.switch.switch-sm", [
					m("input.switch#disable-ga[type='checkbox']"),
					m("label[for='disable-ga']", "Disable sending analytics (Requires restart to take effect)")
				])
			]),

			m(".form-group.mt-3", [
				m('button[type="button"].btn.btn-primary', { onclick: e => saveAppSettings() }, [
					m('span.icon.icon-content-save'),
					' Save'
				]),
				m('button[type="button"].btn.btn-warning.ml-2', { onclick: e => ipcRenderer.send('open-config-file') }, [
					m('span.icon.icon-file-document'),
					' Edit manually'
				])
			])
		])
	}
}