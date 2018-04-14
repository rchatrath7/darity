const video = document.querySelector('video');
const settings = {
	video: true
};

const getMedia = navigator.mediaDevices.getUserMedia(settings);
getMedia.then((stream) => {
	video.srcObject = stream;
	console.log(stream)
	const recorder = stream.record();
	setTimeout(() => {
		recorder.getRecordedData((blob) => {
			const postData = {
				video: blob,
				metadata: 'Recording',
				action: 'upload_video'
			};
			console.log(blob);
		});
	}, 2000);
}).catch((error) => {
	console.error(`Error: ${error}`);
});