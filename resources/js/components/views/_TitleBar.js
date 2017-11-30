exports.TitleBar = {
	view: () => {
		return [
			m('#titlebar', [
				m('.titlebar-buttons', [
					m('a.titlebar-button', { onclick: () => { ipcRenderer.send('win.minimize') } }, [
						m('span.icon.icon-window-minimize')
					]),
					m('a.titlebar-button', { onclick: () => { ipcRenderer.send('win.maximize') } }, [
						m('span.icon.icon-window-maximize')
					]),
					m('a.titlebar-button', { onclick: () => { ipcRenderer.send('win.close') } }, [
						m('span.icon.icon-window-close')
					]),
				]),
				m('.titlebar-title', [
					'Loading...'
				])
			])
		]
	}
}