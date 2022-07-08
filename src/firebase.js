import firebase from 'firebase/compat/app'
import {getDatabase} from "firebase/database";
import 'firebase/compat/auth'
import {getStorage,ref} from "firebase/storage"

const app = firebase.initializeApp({
  apiKey: "AIzaSyAadISmhV2sCfScxBohh8xT1bzCBdCTwVQ",
  authDomain: "premade24-f8d8e.firebaseapp.com",
  databaseURL: "https://premade24-f8d8e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "premade24-f8d8e",
  storageBucket: "premade24-f8d8e.appspot.com",
  messagingSenderId: "573768177973",
  appId: "1:573768177973:web:2ac8994cb1e47a1256147c",
  measurementId: "G-HTY543EB0D",
})

export const auth = app.auth()
export const db = getDatabase(app)
export const storage = getStorage(app)
export function refStorage(path,userId){
  return ref(path ,'/'+ userId)
}

export default app


