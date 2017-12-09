exports.Footer = {
	view: () => {
		let footerVersion;
		if (clientConfig.app.dev === 'yes') footerVersion = `v${build.version} DEV`;
		else footerVersion = `v${build.version}`;
		return [
			m('#footer', [
				m('.footer-version', `${footerVersion}`),
				m('.footer-grabber', [
					m('span.icon.icon-resize-bottom-right')
				])
			])
		]
	}
}