// const video = document.querySelector('video');
// const settings = {
// 	video: true
// };

// const getMedia = navigator.mediaDevices.getUserMedia(settings);
// getMedia.then((stream) => {
// 	video.srcObject = stream;
// 	const recorder = new MediaRecorder(stream);
// 	const recorder = stream.record();
// 	setTimeout(() => {
// 		recorder.getRecordedData((blob) => {
// 			const postData = {
// 				video: blob,
// 				metadata: 'Recording',
// 				action: 'upload_video'
// 			};
// 			console.log(blob);
// 		});
// 	}, 2000);
// }).catch((error) => {
// 	console.error(`Error: ${error}`);
// });

const preview = document.querySelector('video');
const downloadButton = document.querySelector('button');
const recording = document.querySelector('#recording');
const recordingTimeMS = 5000;

function wait(time) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}

function startRecording(stream, lengthInMS) {
	let recorder = new MediaRecorder(stream);
	let data = [];
 
	recorder.ondataavailable = event => data.push(event.data);
	recorder.start();
	console.log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");
 
	let stopped = new Promise((resolve, reject) => {
		recorder.onstop = resolve;
		recorder.onerror = event => reject(event.name);
	});

	let recorded = wait(lengthInMS).then(
		() => recorder.state == "recording" && recorder.stop()
	);
 
	return Promise.all([
		stopped,
		recorded
	])
	.then(() => data);
}

navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	preview.srcObject = stream;
	downloadButton.href = stream;
	preview.captureStream = preview.captureStream || preview.mozCaptureStream;
	return new Promise(resolve => preview.onplaying = resolve);
}).then(() => startRecording(preview.captureStream(), recordingTimeMS))
.then (recordedChunks => {
	let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
	recording.src = URL.createObjectURL(recordedBlob);
	downloadButton.href = recording.src;
	downloadButton.download = "RecordedVideo.webm";
	console.log("Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
})
.catch(console.log);