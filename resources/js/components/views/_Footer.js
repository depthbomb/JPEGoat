exports.Footer = {
	view: () => {
		return [
			m('#footer', [
				m('.footer-version', `v${build.version}`),
				m('.footer-grabber', [
					m('span.icon.icon-resize-bottom-right')
				])
			])
		]
	}
}