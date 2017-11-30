import { TitleBar } from './_TitleBar';
import { Sidebar } from './_Sidebar';
import { Footer } from './_Footer';
exports.Layout = {
	view: (vnode) => {
		return [
			m(TitleBar),
			m(".wrapper", [
				m(Sidebar),
				m('.content', [
					m('.container-fluid.pt-3', vnode.children)
				])
			]),
			m(Footer)
		];
	}
}