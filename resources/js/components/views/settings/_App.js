import { Layout } from '../_Layout';
saveAppSettings = () => {
	let appSettings = {
		previousConversions: document.getElementById('previous-conversions').value,
		outputPath: document.getElementById('output-path').value,
		locale: 'en',
		useWinUi: 'no'
	}

	ipcRenderer.send('save-settings', { section: 'app', data: appSettings });
}
exports.AppSettings = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'App Settings';
	},
	view: (vnode) => {
		return m(Layout, [
			m("h2.text-light.mb-3", "App Settings"),
			m(".form-group.text-light", [
				m("label", "Output folder"),
				m(`input.form-control[type='text'][id='output-path'][value='${clientConfig.app.outputPath}']`),
				m("small.form-text", "The path to the folder that the converted image will be saved to.")
			]),
			m(".form-group.text-light", [
				m("label", "Previous conversions to display", m('span.text-danger', ' [Unavailable]')),
				m(`input.form-control[type='text'][id='previous-conversions'][value='${clientConfig.app.previousConversions}']`),
				m("small.form-text", "Number of previous conversions to display on the main page. Very large numbers could cause performance problems in the application.")
			]),

			m(".form-group", [
				m('button[type="button"].btn.btn-primary', { onclick: e => saveAppSettings() }, [
					m('span.icon.icon-content-save'),
					' Save'
				])
			])
		])
	}
}