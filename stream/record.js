/*
	global SERVER_URL
	global checkLogin
	global getQueryParams
	global FB
*/

const preview = document.querySelector('video');
const buttonRecord = document.querySelector('#record');

function main(user) {
	startCamera();
	const DARE_ID = getQueryParams(document.location.search).dare;
	const recordingTimeMS = 20 * 1000;
	let startedRecording = false;
	buttonRecord.addEventListener('click', (e) => {
		if (!startedRecording) {
			startedRecording = true;
			buttonRecord.innerHTML = `<i class="fa fa-stop"></i>`;
			doRecording(recordingTimeMS).then((blob) => {
				vex.dialog.alert('Uploading dare video...');
				saveRecording(DARE_ID, user.id, blob).then((res) => {
					console.log('Video Link:', res.url);
					//prompt('Video Recorded:', res.url);
					vex.dialog.alert({
						message: 'Dare video uploaded!',
						callback: () => {
							window.location = `dare.html?dare=${DARE_ID}`;
						}
					});
				});
			}).catch(console.error);
		} else {
			window.dispatchEvent(new CustomEvent('stop_recording'));
			buttonRecord.style.display = 'none';
		}
	});
}

checkLogin().then((user) => {
	$.ajax({
		type: 'POST',
		url: `${SERVER_URL}/login?${$.param(user)}`
	}).then(console.log).catch(console.error);
	main(user);
}).catch((err) => {
	console.error(err);
	window.location = 'login.html';
});

// https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element

function wait(time) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}

function saveRecording(dareid, uid, recordedBlob) {
	return new Promise((resolve, reject) => {
		const fd = new FormData();
		fd.append('dare', dareid);
		fd.append('user', uid);
		fd.append('fname', 'video.webm');
		fd.append('data', recordedBlob);
		$.ajax({
			type: 'POST',
			url: `${SERVER_URL}/video/upload`,
			data: fd,
			processData: false,
			contentType: false
		}).done(function(data) {
			const videoURL = `${SERVER_URL}/${data.url}`;
			//console.log(videoURL);
			resolve({
				url: videoURL
			});
		});
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

	window.addEventListener('stop_recording', () => recorder.state == "recording" && recorder.stop());
 
	return Promise.all([
		stopped
		// stopped,
		// recorded
	]).then(() => data);
}

function doRecording(recordingTimeMS) {
	return new Promise((resolveFinal, rejectFinal) => {
		const recording = document.createElement('video');
		navigator.mediaDevices.getUserMedia({
			video: {
				//width: { min: 1024, ideal: 1280, max: 1920 },
				//height: { min: 600, ideal: 720, max: 1080 },
				facingMode: 'user'
			},
			audio: true
		}).then(stream => {
			preview.srcObject = stream;
			preview.captureStream = preview.captureStream || preview.mozCaptureStream;
			return new Promise(resolve => preview.onplaying = resolve);
		}).then(() => startRecording(preview.captureStream(), recordingTimeMS))
		.then(recordedChunks => {
			let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
			const blobURL = URL.createObjectURL(recordedBlob);
			recording.src = blobURL;
			console.log("Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
			//console.log(blobURL);
			resolveFinal(recordedBlob);
		}).catch(rejectFinal);
	});
}

function startCamera() {
	navigator.mediaDevices.getUserMedia({
		video: {
			//width: { min: 1024, ideal: 1280, max: 1920 },
			//height: { min: 600, ideal: 720, max: 1080 },
			facingMode: 'user'
		},
		audio: true
	}).then(stream => {
		preview.srcObject = stream;
	});
}