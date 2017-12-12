import { Layout } from './_Layout';
exports.Index = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'Home';
		ipcRenderer.on('image-processing-complete', e => document.querySelector('.input-trigger').classList.remove('disabled'));
	},
	view: () => {
		return m(Layout, [
			m('a.input-trigger[href="javascript:;"]', { onclick: e => ipcRenderer.send('choose-image', { t: 'file', c: null }) }, [
				m('span.icon.icon-upload'), ' Choose Image'
			]),
			m('.form-group.mt-3', [
				m('.input-group', [
					m('input#url[type="text"][placeholder="...or enter an image URL"].form-control'),
					m('span.input-group-btn', [
						m('button[type="button"].btn.btn-secondary', { onclick: e => {
							let imageUrl = document.getElementById('url').value;
							ipcRenderer.send('choose-image', { t: 'url', c: imageUrl });
							document.getElementById('url').setAttribute('value', '');
						} }, 'Submit')
					])
				])
			])
		])
	}
}