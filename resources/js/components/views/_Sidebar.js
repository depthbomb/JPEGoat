let settingsNavOpen = false;
toggleMenu = (element) => {
	let el = document.getElementById(element);
	if (el.classList.contains('open')) {
		settingsNavOpen = false;
		el.classList.remove("open");
	} else {
		settingsNavOpen = true;
		el.classList.add("open");
	}
}
exports.Sidebar = {
	oncreate: () => {
		if (settingsNavOpen) document.getElementById('settings').classList.add('open');
		else document.getElementById('settings').classList.remove('open');
	},
	view: () => {
		return m("nav#sidebar", [
			m(".sidebar-header",
				m("h3", "JPEGoat")
			),
			m("ul", [
				m("li", m("a[href='/']", { oncreate: m.route.link }, [ m('span.icon.icon-home'), " Home" ])),
				m("li", [
					m("a[href='javascript:;']", { onclick: e => toggleMenu('settings') }, [ m('span.icon.icon-settings'), " Settings" ]),
					m(`ul.sidebar-dropdown-menu[id='settings']`, [
						m("li", m("a[href='/settings/app']", { oncreate: m.route.link }, "App")),
						m("li", m("a[href='/settings/imgur']", { oncreate: m.route.link }, "Imgur"))
					])
				])
			])
		])
	}
}