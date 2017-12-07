import { remote } from 'electron';
const currentWindow = remote.getCurrentWindow();
exports.TitleBar = {
	oncreate: () => {
		let iconElement = document.getElementById('maximize');
		currentWindow.on('maximize', e => iconElement.setAttribute('d', "m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"));
		currentWindow.on('unmaximize', e => iconElement.setAttribute('d', "M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"));
	},
	view: () => {
		return m('#titlebar', [
			m('.resize-handle.resize-handle-top'),
			m('.resize-handle.resize-handle-left'),
			m(`img[src="${path.join(basePath, 'assets/img/icons/png/32x32.png')}"].titlebar-icon`),
			m('.titlebar-title', 'Loading...'),
			m('.titlebar-buttons', [
				m('a.titlebar-button', { onclick: e => currentWindow.minimize() },
					m("svg[height='10'][version='1.1'][width='10']",
						m("path#minimize[d='M 0,5 10,5 10,6 0,6 Z']")
					)
				),
				m('a.titlebar-button', { onclick: e => currentWindow.isMaximized() ? currentWindow.unmaximize() : currentWindow.maximize() }, [
					m("svg[height='10'][version='1.1'][width='10']",
						m("path#maximize[d='M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z']")
					)
				]),
				//	Dispatch an event to the main process rather than immediately closing
				//	so we can do any cleaning up before actually quitting.
				m('a.titlebar-button', { onclick: e => ipcRenderer.send('win.close') },
					m("svg[height='10'][version='1.1'][width='10']",
						m("path#close[d='M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z']")
					)
				)
			])
		])
	}
}