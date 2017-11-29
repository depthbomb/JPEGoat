import { Layout } from './_Layout';

const saveSettings = () => {
	let settingsObj = {
		app: {
			locale: document.getElementById('app-locale').value,
			imgur: {
				username: document.getElementById('imgur-username').value,
				password: document.getElementById('imgur-password').value,
				client: document.getElementById('imgur-client').value,
				album: document.getElementById('imgur-album').value
			}
		}
	}

	ipcRenderer.send('save-settings', settingsObj);	//..Send the object to the main process
};

let userConfig;
exports.Settings = {
	oninit: () => {
		userConfig = ini.parse(fs.readFileSync(path.join(rendererConfig.dirs.config, 'client.ini'), 'utf-8'));
	},
	view: () => {
		let appLocale = userConfig.app.locale;

		let imgurUsername = userConfig.app.imgur.username;
		let imgurPassword = userConfig.app.imgur.password;
		let imgurClient = userConfig.app.imgur.client;
		let imgurAlbum = userConfig.app.imgur.album;

		return m(Layout, [
			m(".container-fluid", [
				m('.card.bg-darker.text-light', [
					m('.card-body', [
						m('h3.text-light', 'App settings'),
						m('.form-group', [
							m('label', 'Language'),
							m('select#app-locale.form-control', [
								m('option[value="en"][selected][default]', 'English')
							])
						])
					])
				]),
				m('.card.bg-darker.text-light.mt-3', [
					m('.card-body', [
						m('h3.text-light', 'Imgur upload settings'),
						m('p', 'To use this feature you must register an account (or use an existing one) and enter your info here.'),
						m('.form-group', [
							m('label', 'Username'),
							m(`input#imgur-username.form-control[type="text"][value="${imgurUsername === null ? '' : imgurUsername}"]`)
						]),
						m('.form-group', [
							m('label', 'Password'),
							m(`input#imgur-password.form-control[type="password"][value="${imgurPassword === null ? '' : imgurPassword}"]`)
						]),
						m('.form-group', [
							m('label', 'Client token'),
							m(`input#imgur-client.form-control[type="text"][value="${imgurClient === null ? '' : imgurClient}"]`)
						]),
						m('.form-group', [
							m('label', 'Album hash'),
							m(`input#imgur-album.form-control[type="text"][value="${imgurAlbum === null ? '' : imgurAlbum}"][placeholder="https://imgur.com/a/######"]`)
						])
					])
				]),
				m('.form-group.mt-3.btn-group', [
					m('button.btn.btn-primary', { onclick: () => saveSettings() }, [ m('span.icon.icon-content-save'), ' Save' ]),
					m('button.btn.btn-danger', 'Restore defaults')
				])
			])
		])
	}
}