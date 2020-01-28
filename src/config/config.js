import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
// import {
//   apiKey,
//   authDomain,
//   databaseURL,
//   projectId,
//   storageBucket,
//   messagingSenderId,
//   appId,
//   measurementId,
// } from 'react-native-dotenv';
const firebaseConfig = {
  apiKey: "AIzaSyB9DIwL7qQTf_WY4Tm4BZDQmGMIDIDUieo",
  authDomain: "chit-chat-69afc.firebaseapp.com",
  databaseURL: "https://chit-chat-69afc.firebaseio.com",
  projectId: "chit-chat-69afc",
  storageBucket: "chit-chat-69afc.appspot.com",
  messagingSenderId: "858726157416",
  appId: "1:858726157416:web:6bdf231d0545e0b4ae3fdd",
  measurementId: "G-2CKEF7FCEE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
