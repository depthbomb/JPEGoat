import { Layout } from './_Layout';
exports.Index = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'Home';
		ipcRenderer.on('image-processing-complete', e => document.querySelector('.input-trigger').classList.remove('disabled'));
	},
	view: () => {
		return m(Layout, [
			m('a.input-trigger[href="javascript:;"]', { onclick: e => ipcRenderer.send('choose-image') }, [
				m('span.icon.icon-upload'), ' Choose Image'
			])
		])
	}
}