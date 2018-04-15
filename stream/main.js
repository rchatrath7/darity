/*
  global SERVER_URL
  global checkLogin
*/

const preview = document.querySelector('video');
const buttonRecord = document.querySelector('#record');

function main(user) {
  console.log(user);
  const recordingTimeMS = 5000;
  buttonRecord.addEventListener('click', (e) => {
    doRecording(user.id, recordingTimeMS);
  });
}

checkLogin().then((user) => {
  $.ajax({
    type: 'POST',
    url: `${SERVER_URL}/login`,
    data: user
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
  ]).then(() => data);
}

function doRecording(uid, recordingTimeMS) {
  const recording = document.createElement('video');
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    preview.srcObject = stream;
    preview.captureStream = preview.captureStream || preview.mozCaptureStream;
    return new Promise(resolve => preview.onplaying = resolve);
  }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
  .then (recordedChunks => {
    let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
    const blobURL = URL.createObjectURL(recordedBlob);
    recording.src = blobURL;
    console.log("Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
    console.log(blobURL);
    const fd = new FormData();
    fd.append('uid', uid);
    fd.append('fname', 'video.webm');
    fd.append('data', recordedBlob);
    $.ajax({
      type: 'POST',
      url: `${SERVER_URL}/video`,
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
      console.log(data);
      console.log(`${SERVER_URL}/${data.url}`);
    });
  }).catch(console.log);
}