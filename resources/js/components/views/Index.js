import { Layout } from './_Layout';
exports.Index = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'Home';
	},
	view: () => {
		return m(Layout, [
			m('a.input-trigger[href="javascript:;"]', { onclick: () => {
					ipcRenderer.send('choose-image', true);
				} }, [
					m('span.icon.icon-upload'),
					' Choose Image'
				])
		])
	}
}