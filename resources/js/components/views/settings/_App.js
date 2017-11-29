import { Layout } from '../_Layout';
exports.Index = {
	view: () => {
		return m(Layout, [
			m(".container-fluid",
				m(".card.bg-darker.text-light", [
					m(".card-body", [
						m('input[type="file"]')
					])
				])
			)
		])
	}
}