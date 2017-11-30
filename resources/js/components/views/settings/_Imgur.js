import { Layout } from '../_Layout';
exports.ImgurSettings = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'Imgur Settings';
	},
	view: () => {
		return [
			m(Layout, [
				m(".card.bg-darker.text-light", [
					m(".card-body", [
						m('h1', 'Imgur settings')
					])
				])
			])
		]
	}
}