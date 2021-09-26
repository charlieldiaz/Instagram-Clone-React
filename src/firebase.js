import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfXcXu7Ep74pTViP51v9mSCTOkmvSNVg4",
  authDomain: "ig-clone-cd.firebaseapp.com",
  databaseURL: "https://ig-clone-cd-default-rtdb.firebaseio.com",
  projectId: "ig-clone-cd",
  storageBucket: "ig-clone-cd.appspot.com",
  messagingSenderId: "251635258945",
  appId: "1:251635258945:web:ec3d3516dbc94e57c7d8c0",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
