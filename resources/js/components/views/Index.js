import { Layout } from './_Layout';
exports.Index = {
	oncreate: () => {
		document.querySelector('.titlebar-title').innerHTML = 'Home';
	},
	view: () => {
		return m(Layout, [
			m(".card.bg-darker.text-light", [
				m(".card-body", [
					m('input[type="file"]')
				])
			])
		])
	}
}