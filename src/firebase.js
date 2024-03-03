import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCf9mvu-swfL-DTDeAa46uuBsQ-2Mzi95Q",
  authDomain: "website-crazygamedev.firebaseapp.com",
  databaseURL: "https://website-crazygamedev-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "website-crazygamedev",
  storageBucket: "website-crazygamedev.appspot.com",
  messagingSenderId: "563749955199",
  appId: "1:563749955199:web:3fe0fc56fde719b504c14a",
  measurementId: "G-1FLD664XDG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // exporting db
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, database };
