import firebase from "firebase";
import "firebase/storage";
import React from "react";
const firebaseConfig = {
  apiKey: "AIzaSyDrtRfWNI6PCCfKvln4X1HoRSDjC0YH4ac",
  authDomain: "whatsapp-clone-29961.firebaseapp.com",
  projectId: "whatsapp-clone-29961",
  storageBucket: "whatsapp-clone-29961.appspot.com",
  messagingSenderId: "35272786119",
  appId: "1:35272786119:web:5a4db51e6dd05dd70d3ee2"
};
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore();
  const deleteField=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  const provider=new firebase.auth.GoogleAuthProvider();
  const uploadBytes=firebaseApp.storage();
  export {auth ,provider ,deleteField , storage ,uploadBytes};
  export default db;

