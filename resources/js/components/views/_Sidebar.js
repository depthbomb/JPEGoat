exports.Sidebar = {
	view: () => {
		return m("nav[id='sidebar']", [
			m(".sidebar-header",
				m("h3", "JPEGoat", [
					m('small.header-version', `v${build.version}`)
				])
			),
			m("ul", [
				m("li", m("a[href='/']", { oncreate: m.route.link }, [ m('span.icon.icon-home'), " Home" ])),
				m("li", [
					m("a[href='javascript:;']", {
						onclick: () => {
							document.getElementById('settings').classList.toggle("open");
						}
					}, [ m('span.icon.icon-settings'), " Settings" ]),
					m("ul.sidebar-dropdown-menu[id='settings']", [
						m("li", m("a[href='/settings/app']", { oncreate: m.route.link }, "App")),
						m("li", m("a[href='/settings/imgur']", { oncreate: m.route.link }, "Imgur"))
					])
				])
			])
		])
	}
}