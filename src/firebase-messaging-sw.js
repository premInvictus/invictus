
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
var config = {
    apiKey: "AIzaSyAD31jc55BGw7Iiic79wFLUsrBEqQTkGTM",
    authDomain: "invictus-erp.firebaseapp.com",
    databaseURL: "https://invictus-erp.firebaseio.com",
    projectId: "invictus-erp",
    storageBucket: "invictus-erp.appspot.com",
    messagingSenderId: "103028680703",

};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();