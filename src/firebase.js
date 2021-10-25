import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBgViPvr_4pW-ZZaKuLn0pLqXzouE0K6RA",
  authDomain: "img-app-8719c.firebaseapp.com",
  projectId: "img-app-8719c",
  storageBucket: "img-app-8719c.appspot.com",
  messagingSenderId: "843508408914",
  appId: "1:843508408914:web:d5786663c897062942b58b"
})

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const googleAuthProvider = new GoogleAuthProvider();
const microsoftAuthProvider = new OAuthProvider('microsoft.com');

export { auth, db, storage, googleAuthProvider, microsoftAuthProvider }