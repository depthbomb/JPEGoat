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
			m("h2.text-light.mb-3", "Imgur Upload"),
			m(".form-group.text-light", [
				m("span.switch.switch-sm", [
					m("input.switch[id='enabled'][type='checkbox']"),
					m("label[for='enabled']", "Enabled")
				]),
				m('p', ['This feature will automatically upload your images to an Imgur album once processed. You must have an application associated with your Imgur account. You can create an application ', m('a[href="javascript:;"]', { onclick: e => remote.shell.openExternal('https://imgur.com/account/settings/apps') }, 'here.')])
			]),
			m(".form-group.text-light", [
				m("label", "Username"),
				m(`input.form-control[type="text"][id='username'][value='${clientConfig.imgur.username}']`)
			]),
			m(".form-group.text-light", [
				m("label", "Password"),
				m(`input.form-control[type="password"][id='password'][value='${clientConfig.imgur.password}']`)
			]),
			m(".form-group.text-light", [
				m("label", "Client token"),
				m(`input.form-control[type="text"][id='client'][value='${clientConfig.imgur.client}']`)
			]),
			m(".form-group.text-light", [
				m("label", "Album hash"),
				m(`input.form-control[type="text"][id='album'][value='${clientConfig.imgur.album}']`),
				m("small.form-text", "This is the string of characters at the end of an album URL. This album must be created with same account that the above credentials belong to.")
			]),

			m(".form-group", [
				m('button[type="button"].btn.btn-primary', { onclick: e => saveImgurSettings() }, [
					m('span.icon.icon-content-save'),
					' Save'
				])
			])
		])
	}
}