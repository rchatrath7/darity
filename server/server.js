require('dotenv').config();

const firebase = require('firebase');
const express = require('express');
const multer = require('multer');
const app = express();

const config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId
};
const FirebaseApp = firebase.initializeApp(config, 'Darity Server');
const db = FirebaseApp.database();

console.log("Started Darity Server.");

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const PUBLIC_DIR = 'public';
const VIDEO_DIR = 'videos';
app.use(express.static(PUBLIC_DIR));

const videoStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + `/${PUBLIC_DIR}/${VIDEO_DIR}`);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '.webm');
	}
});
const videoUpload = multer({storage: videoStorage}).single('data');

app.post("/video", videoUpload, function (request, response) {
	const id = request.params.id;
	const state = request.query;
	console.log(request.body);
	console.log(request.file);
	const file = request.file;
	response.send({
		success: true,
		url: `${VIDEO_DIR}/${file.filename}`
	});
});

const PORT_NUM = process.env.PORT;
const listener = app.listen(PORT_NUM, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});
