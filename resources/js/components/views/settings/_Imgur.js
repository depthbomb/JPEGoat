import { Layout } from '../_Layout';
saveImgurSettings = () => {
	let imgurSettings = {
		enabled: document.getElementById('enabled').checked ? 'yes' : 'no',
		username: document.getElementById('username').value,
		password: document.getElementById('password').value,
		client: document.getElementById('client').value,
		album: document.getElementById('album').value
	}

	ipcRenderer.send('save-settings', { section: 'imgur', data: imgurSettings });
}
exports.ImgurSettings = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'Imgur Settings';
		clientConfig.imgur.enabled === 'yes'
			? document.getElementById('enabled').checked = true
			: document.getElementById('enabled').checked = false;
	},
	view: () => {
		return m(Layout, [
			m("h2.mb-3", "Imgur Upload"),
			m(".form-group", [
				m("span.switch.switch-sm", [
					m("input.switch#enabled[type='checkbox']"),
					m("label[for='enabled']", "Enabled")
				]),
				m('p', ['This feature will automatically upload your images to an Imgur album once processed. You must have an application associated with your Imgur account. You can create an application ', m('a[href="javascript:;"]', { onclick: e => remote.shell.openExternal('https://imgur.com/account/settings/apps') }, 'here.')])
			]),

			m(".form-group", [
				m("label", "Username"),
				m(`input.form-control#username[type="text"][value='${clientConfig.imgur.username}']`)
			]),

			m(".form-group", [
				m("label", "Password"),
				m(`input.form-control#password[type="password"][value='${clientConfig.imgur.password}']`)
			]),

			m(".form-group", [
				m("label", "Client token"),
				m(`input.form-control#client[type="text"][value='${clientConfig.imgur.client}']`)
			]),

			m(".form-group", [
				m("label", "Album hash"),
				m(`input.form-control#album[type="text"][value='${clientConfig.imgur.album}']`),
				m("small.form-text", "This is the string of characters at the end of an album URL. This album must be created with same account that the above credentials belong to.")
			]),

			m(".form-group.mt-3", [
				m('button[type="button"].btn.btn-primary', { onclick: e => saveImgurSettings() }, [
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