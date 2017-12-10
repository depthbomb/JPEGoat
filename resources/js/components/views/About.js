import { Layout } from './_Layout';
exports.About = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'About JPEGoat';

		ipcRenderer.send('check-version');
		ipcRenderer.on('checked-version', (event, data) => {
			let element = document.getElementById('version-check');
			if (data) {
				let downloadLink = document.createElement('a');
				downloadLink.setAttribute('href', 'javascript:;');
				downloadLink.innerHTML = 'New version available!';
				downloadLink.addEventListener('click', () => {
					shell.openExternal('https://github.com/depthbomb/JPEGoat/releases/latest');
				});
				element.innerHTML = '';
				element.appendChild(downloadLink);
			} else {
				element.innerHTML = 'You are using the latest version.';
			}
		});
	},
	view: () => {
		return m(Layout, [
			m('h1.text-light', m(`img#logo.rounded-circle[src="${path.join(basePath, 'assets/img/icons/png/48x48.png')}"][style="vertical-align:top;"]`, { onclick: e => document.getElementById('logo').classList.toggle('spin') }), ' JPEGoat v' + build.version),
			m('small#version-check.text-muted', 'Checking for new version...'),
			m('hr.my-4'),
			m('p.m-0', 'Author:', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/depthbomb') }, ' https://github.com/depthbomb')),
			m('p', 'Project page:', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/depthbomb/JPEGoat') }, ' https://github.com/depthbomb/JPEGoat')),
			m('.more-info.mt-4.p-3', { style: { 'max-height': '250px', 'overflow-x': 'auto', 'background-color': 'rgba(0,0,0,.25)', 'border-radius': '5px' } }, [
				m('p', 'Like what I do? Support me by donating!', [
					m('ul', [
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('http://a.co/fLLYCyi') }, 'Feed my WoW addition'))
					])
				]),
				m('hr.my-4'),
				m('p.m-0', 'Caprine Softworks logo design: ', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('http://steamcommunity.com/profiles/76561198027621507/') }, '[INSERTCOIN]')),
				m('p.m-0', 'External modules: ', [
					m('ul', [
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/caolan/async') }, 'async')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/ericelliott/cuid') }, 'cuid')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/kaimallea/node-imgur') }, 'imgur')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/isaacs/ini') }, 'ini')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/oliver-moran/jimp') }, 'jimp')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/MithrilJS/mithril.js') }, 'mithril')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/moment/moment') }, 'moment')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/automation-stack/node-machine-id') }, 'node-machine-id')),
						m('li', m('a[href="javascript:;"]', { onclick: e => shell.openExternal('https://github.com/request/request') }, 'request'))
					])
				])
			])
		])
	}
}