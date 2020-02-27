
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
var config = {
	apiKey: "AIzaSyAg88lKw0PB73i3wI_fnyNbk_sdWU2VTQU",
    authDomain: "test-notification-17c3a.firebaseapp.com",
    databaseURL: "https://test-notification-17c3a.firebaseio.com",
    projectId: "test-notification-17c3a",
    storageBucket: "test-notification-17c3a.appspot.com",
    messagingSenderId: "7217963122",
};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();