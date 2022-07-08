import firebase from 'firebase/compat/app'
import {getDatabase} from "firebase/database";
import 'firebase/compat/auth'
import {getStorage,ref} from "firebase/storage"

//put in your config


export const auth = app.auth()
export const db = getDatabase(app)
export const storage = getStorage(app)
export function refStorage(path,userId){
  return ref(path ,'/'+ userId)
}

export default app


