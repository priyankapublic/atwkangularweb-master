importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
//  importScripts('https://www.gstatic.com/firebasejs/7.11.0/firebase-analytics.js');

firebase.initializeApp({
    apiKey: "AIzaSyDGjAgM3sPX33tEFxouSBZf1JmsDtMuopE",
    authDomain: "ask-those-who-know-155117.firebaseapp.com",
    databaseURL: "https://ask-those-who-know-155117.firebaseio.com",
    projectId: "ask-those-who-know-155117",
    storageBucket: "ask-those-who-know-155117.appspot.com",
    messagingSenderId: "256446471226",
    appId: "1:256446471226:web:eab1d0182219973937a903",
    measurementId: "G-0QQRT8SP5R"
});
//  firebase.analytics();
const messaging = firebase.messaging();