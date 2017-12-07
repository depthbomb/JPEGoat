exports.Dialog = {
	oncreate: () => {
		/**
		 * The main process will send the progress of the image processing
		 * which we will handle here.
		 */
		const progressStatus = document.querySelector('.dialog-header');
		const progressBar = document.querySelector('.progress-bar');
		ipcRenderer.on('update-progress', (event, data) => {
			if (data.success) {
				if (data.complete) return document.getElementById('dialog').style.display = 'none';

				document.getElementById('dialog').style.display = 'block';
				progressStatus.innerHTML = data.status;
				progressBar.style.width = data.progress;
			} else {
				alert('Error\n\n' + data.error);
			}
		});
	},
	view: () => {
		return m('#dialog', [
			m('.dialog-backdrop',
				m('.dialog-content', [
					m('.dialog-header', 'Waiting...'),
					m('.dialog-progress', [
						m('.progress', [
							m('.progress-bar.bg-info', { style: { 'width': '0%' } })
						])
					])
				])
			)
		])
	}
}