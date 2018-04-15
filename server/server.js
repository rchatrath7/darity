require('dotenv').config();

const firebase = require('firebase');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const PUBLIC_DIR = 'public';
const VIDEO_DIR = 'videos';
app.use(express.static(PUBLIC_DIR));

const videoStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + `/${PUBLIC_DIR}/${VIDEO_DIR}`);
	},
	filename: function (req, file, cb) {
		cb(null, `${req.body.uid}-${Date.now()}.webm`);
	}
});
const videoUpload = multer({storage: videoStorage}).single('data');

app.get('/hello', function(request, response) {
	response.send({
		value: 'Hello World!'
	});
});

app.post('/give', function(request, response) {
	const query = request.query;
	const dareid = query.dare;
	const userid = query.user;
	const amount = parseFloat(query.amount);
	if (!userid || !dareid || !amount) {
		response.send({
			success: false,
			error: 'Must provide user id, dare id, and amount.'
		});
	} else {
		const donationData = {
			dare: dareid,
			user: userid,
			amount: amount,
			timestamp: Date.now()
		};
		db.ref(`donations`).push(donationData).then((done) => {
			response.send({
				success: true
			});
		}).catch((error) => {
			response.send({
				success: false,
				error: `DatabaseError: ${error}`
			});
		});
	}
});

app.post('/login', function(request, response) {
	const query = request.query;
	const uid = query.id;
	if (!uid) {
		response.send({
			success: false,
			error: 'Missing user id.'
		});
	} else {
		db.ref(`users/${uid}`).set(query).then((done) => {
			response.send({
				success: true
			});
		}).catch((error) => {
			response.send({
				success: false,
				error: `DatabaseError: ${error}`
			});
		});
	}
});

app.get('/profile', function(request, response) {
	const query = request.query;
	const uid = query.id;
	if (uid) {
		db.ref(`users/${uid}`).once('value', (snap) => {
			const profile = snap.val() || false;
			if (profile) {
				response.send(profile);
			} else {
				response.send({
					success: false,
					error: `No profile for user id: ${uid}`
				});
			}
		});
	} else {
		response.send({
			success: false,
			error: 'Missing user id.'
		});
	}
});

app.get('/dare', function(request, response) {
	const query = request.query;
	const id = query.id;
	if (id) {
		db.ref(`dares/${id}`).once('value', (snap) => {
			const daraData = snap.val() || false;
			if (daraData) {
				response.send(daraData);
			} else {
				response.send({
					success: false,
					error: `No data for dare id: ${id}`
				});
			}
		});
	} else {
		response.send({
			success: false,
			error: 'Missing dare id.'
		});
	}
});

app.post('/video', videoUpload, function(request, response) {
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
