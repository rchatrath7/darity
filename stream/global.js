/* global firebase */

const FirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBJE9CK0KN_T5ean3jts6PEjP2hL9lyEps',
  authDomain: 'darityserver.firebaseapp.com',
  databaseURL: 'https://darityserver.firebaseio.com',
  projectId: 'darityserver',
  storageBucket: 'darityserver.appspot.com',
  messagingSenderId: '896239056097'
}, 'Darity Server');

const facebookProvider = new firebase.auth.FacebookAuthProvider();

function loginWithFacebook() {
  return new Promise((resolve, reject) => {
    FirebaseApp.auth().signInWithPopup(facebookProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const token = result.credential.accessToken;
      const user = result.user;
      resolve(user);
    }).catch(reject);
  });
}

const SERVER_URL = 'https://74484cce.ngrok.io';

function getProvider(source) {
  return source.providerData[0].providerId.split('.')[0];
}

function getUserData(source) {
  return {
    id: source.uid,
    name: source.displayName,
    email: source.email,
    photo: source.photoURL,
    provider: getProvider(source)
  }
}

function checkLogin() {
  return new Promise((resolve, reject) => {
    FirebaseApp.auth().onAuthStateChanged(function(user) {
      if (user) {
        //console.log('User signed in.');
        //console.log(user);
        const userData = getUserData(user);
        resolve(userData);
      } else {
        reject('No user signed in.');
      }
    });
  });
}