import { TitleBar } from './_TitleBar';
import { Header } from './_Header';
import { Sidebar } from './_Sidebar';
exports.Layout = {
	view: (vnode) => {
		return [
			m(TitleBar),
			m(".wrapper", [
				m(Sidebar),
				m('.content.pt-3', [
					m('.container-fluid', vnode.children)
				])
			])
		];
	}
}