exports.Header = {
	view: (vnode) => {
		return m('h1.mb-2.p-0', [
			'JPEGoat',
			m('small', ` v${build.version}`)
		])
	}
}