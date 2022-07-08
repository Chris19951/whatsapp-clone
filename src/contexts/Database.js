import { db, auth } from "../firebase";
import {ref, set,push,increment,update} from "firebase/database";

//setFunction for userData
export  function writeUserData(name, email) {
    const userId = auth.currentUser.uid
     set(ref(db, 'Users/' + userId ), {
        user_id: userId,
        user_chats:"",
        user_name: name,
        user_picture: "https://firebasestorage.googleapis.com/v0/b/premade24-f8d8e.appspot.com/o/Unbenannt.PNG?alt=media&token=7a1510d3-531b-48f4-9e0c-df583cb2e65c",
        user_status: "online",
     });
}
//setFunction for my last message information
export  function setMyLastMessage(message,id) {
  const userId = auth.currentUser.uid
  set(ref(db, 'Users/' + id + '/user_chats/' +userId   ), {
    lastMessageContent:'You: '+message,
    timeLastMessage: Date.now(),
    messageRead:0,
    });
}
//setFunction for opponent last message information
export  function setThereLastMessage(message,id) {
  const userId = auth.currentUser.uid
  set(ref(db, 'Users/' + userId + '/user_chats/' +id   ), {
    lastMessageContent:message,
    timeLastMessage: Date.now(),
    messageRead:increment(1),
    });
}
//push the message into the db
export  function pushMessage(content, id) {
  const userId = auth.currentUser.uid
  const d = new Date();
  var minutes = d.getMinutes()
  var hours = d.getHours()
  if(d.getMinutes()<10){
    minutes = "0"+d.getMinutes()
  }
  if(d.getHours()<10){
    hours = "0"+d.getHours()
  }
  const date = hours+":"+minutes
  push(ref(db, 'chats/' + userId + id ), {
      content:content,
      date:date,
      id:userId,
    });
}
//push the message into the opponent db
export  function pushMessageOther(content, id) {
  const userId = auth.currentUser.uid
  const d = new Date();
  var minutes = d.getMinutes()
  var hours = d.getHours()
  if(d.getMinutes()<10){
    minutes = "0"+d.getMinutes()
  }
  if(d.getHours()<10){
    hours = "0"+d.getHours()
  }
  const date = hours+":"+minutes
  push(ref(db, 'chats/' + id + userId   ), {
      content:content,
      date:date,
      id:userId,
    });
 }
 //reset the unread message counter to zero
 export  function resetCounter(id) {
   const userId = auth.currentUser.uid
      update(ref(db, 'Users/' + id +'/user_chats/' +userId ), {
         messageRead:0,
      });
 }
// funktion for updateing the user picture
export  function updateUserPicture(path) {
  const userId = auth.currentUser.uid
  update(ref(db, 'Users/' + userId  ), {
    user_picture:path,
  });
}
// funktion for updating the user picture
export  function updateUsername(username) {
  const userId = auth.currentUser.uid
      update(ref(db, 'Users/' + userId  ), {
        user_name:username,
      });
}