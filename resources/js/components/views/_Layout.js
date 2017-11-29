import { Header } from './_Header';
import { Sidebar } from './_Sidebar';
exports.Layout = {
	view: (vnode) => {
		return [
			m(".wrapper", [
				m(Sidebar),
				m('.content.pt-3', [
					vnode.children
				])
			])
		];
	}
}