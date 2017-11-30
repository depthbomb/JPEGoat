import { Layout } from '../_Layout';
exports.AppSettings = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'App Settings';
	},
	view: () => {
		return [
			m(Layout, [
				m(".card.bg-darker.text-light", [
					m(".card-body", [
						m('h1', 'App settings')
					])
				])
			])
		]
	}
}