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

const stripe = require('stripe')(process.env.STRIPE_TOKEN);

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
		//cb(null, `${req.body.uid}-${Date.now()}.webm`);
		cb(null, `${req.body.dare}.webm`);
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
	const amount = parseInt(query.amount);
	const token = request.body.token;
	if (!userid || !dareid || !amount || !token) {
		response.send({
			success: false,
			error: 'Must provide user id, dare id, amount, and Stripe token.'
		});
	} else {
		const charge = stripe.charges.create({
			amount: amount,
			currency: 'usd',
			description: 'Donation to Darity',
			source: token,
		});
		charge.then((success) => {
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
		}).catch((error) => {
			response.send({
				success: false,
				error: `PaymentError: ${error}`
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

function getDonationList(id) {
	return new Promise((resolve, reject) => {
		const ref = db.ref(`donations`).orderByChild('dare').equalTo(id);
		ref.once('value', (donationSnap) => {
			const donationVal = donationSnap.val() || {};
			const donationList = Object.keys(donationVal).map((key) => {
				let donationData = donationVal[key];
				donationData.id = key;
				return donationData;
			});
			resolve({
				id: id,
				list: donationList
			});
		});
	});
}

function getCharity(id) {
	return new Promise((resolve, reject) => {
		db.ref(`charities/${id}`).once('value', (snap) => {
			const val = snap.val() || {};
			resolve({
				id: id,
				charity: val
			});
		});
	});
}

app.get('/dares/data/:id', function(request, response) {
	const id = request.params.id;
	if (id) {
		db.ref(`dares/${id}`).once('value', (snap) => {
			const dareData = snap.val() || false;
			if (dareData) {
				const promises = [getCharity(dareData.charity), getDonationList(id)];
				Promise.all(promises).then((resData) => {
					const charityRes = resData[0];
					const listRes = resData[1];
					response.send({
						dare: dareData,
						donations: listRes.list,
						charity: charityRes.charity
					});
				}).catch((error) => {
					response.send({
						success: false,
						error: `DatabaseError: ${error}`
					});
				});
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

app.get('/dares/view/:id', function(request, response) {
	const id = request.params.id;
	if (id) {
		db.ref(`dares/${id}`).once('value', (snap) => {
			const dareData = snap.val() || false;
			if (dareData) {
				response.send(dareData);
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

function saveDareRevision(id, dareData) {
	dareData.timestamp = Date.now();
	return db.ref(`dare_revisions/${id}`).push(dareData);
}

app.post('/dares/create', function(request, response) {
	let query = request.query;
	query.created = Date.now();
	db.ref(`dares`).push(query).then((done) => {
		const pushid = done.path.pieces_[1];
		saveDareRevision(pushid, query);
		response.send({
			success: true,
			id: pushid
		});
	}).catch((error) => {
		response.send({
			success: false,
			error: `DatabaseError: ${error}`
		});
	});
});

app.post('/dares/update/:id', function(request, response) {
	const id = request.params.id;
	const query = request.query;
	if (!id) {
		response.send({
			success: false,
			error: 'Missing dare id.'
		});
	} else {
		db.ref(`dares/${id}`).once('value', (snap) => {
			const val = snap.val() || {};
			for (let attr in query) {
				val[attr] = query[attr];
			}
			db.ref(`dares/${id}`).set(val).then((done) => {
				saveDareRevision(id, val);
				response.send({
					success: true
				});
			}).catch((error) => {
				response.send({
					success: false,
					error: `DatabaseError: ${error}`
				});
			});
		});
	}
});

app.post('/charities/update/:id', function(request, response) {
	const id = request.params.id;
	const query = request.query;
	if (!id) {
		response.send({
			success: false,
			error: 'Missing charity id.'
		});
	} else {
		db.ref(`charities/${id}`).once('value', (snap) => {
			const val = snap.val() || {};
			for (let attr in query) {
				val[attr] = query[attr];
			}
			db.ref(`charities/${id}`).set(val).then((done) => {
				response.send({
					success: true
				});
			}).catch((error) => {
				response.send({
					success: false,
					error: `DatabaseError: ${error}`
				});
			});
		});
	}
});

app.get('/video/view/:id', function(request, response){
	const id = request.params.id;
	db.ref(`dares/${id}/video`).once('value', (snap) => {
		const url = snap.val();
		if (url) {
			response.redirect(`${process.env.HOST}/${url}`);
		} else {
			response.send({
				success: false,
				error: 'There is no video for this dare yet.'
			});
		}
	});
});

app.post('/video/upload', videoUpload, function(request, response){
	console.log(request.body);
	console.log(request.file);
	const file = request.file;
	const userid = request.body.user;
	const dareid = request.body.dare;
	const videoURL = `${VIDEO_DIR}/${file.filename}`;
	db.ref(`dares/${dareid}`).once('value', (snap) => {
		const val = snap.val() || {};
		if (val.daredevil === userid) {
			db.ref(`dares/${dareid}/video`).set(videoURL).then((done) => {
				response.send({
					success: true,
					url: videoURL
				});
			}).catch((error) => {
				response.send({
					success: false,
					error: `DatabaseError: ${error}`
				});
			})
		} else {
			response.send({
				success: false,
				error: 'User is not the daredevil for this dare.'
			});
		}
	});
});

const PORT_NUM = process.env.PORT;
const listener = app.listen(PORT_NUM, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});
