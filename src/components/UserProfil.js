import {auth} from "../firebase";
import {resetCounter} from '../contexts/Database';

export default function UserProfil({name,picture,lastMessage,childId,opponentId}) {
    //getting own user id
    const userId = auth.currentUser.uid
    //setting values
    var message = "New Chat";
    var date = "";
    var counter = 0;
    var activeTimeColor = "#ffffff6c";
    var activeMessageColor = "#ffffff6c";

    //ask if in the opponent user Object is 
    //there an lastMessage object with your id
    if(lastMessage[userId]===undefined){
    }else{
        //set the lastmessage and time from db
        if(lastMessage[userId].lastMessageContent!==undefined){
            message = lastMessage[userId].lastMessageContent
        }
        if(message.length>=20){
            message=message.slice(0,20)+"..."
        }
        counter = lastMessage[userId].messageRead
    }
    var date = false
    //generate new time object
    if(lastMessage[userId]!==undefined){
        if(lastMessage[userId].timeLastMessage!==undefined){
            const dateLastMessage   = new Date((lastMessage[userId].timeLastMessage))
            var minutes = dateLastMessage.getMinutes()
            var hours = dateLastMessage.getHours()
            if(dateLastMessage.getMinutes()<10){
            minutes = "0"+dateLastMessage.getMinutes()
            }
            if(dateLastMessage.getHours()<10){
            hours = "0"+dateLastMessage.getHours()
            }
            date = hours+":"+minutes
        }
    }
    if(counter!==0){
        activeTimeColor="#0ec997f7";
        activeMessageColor = "white";
        if(opponentId===childId){
            resetCounter(childId)
        }
    }
    return (
      <div onClick={() =>  resetCounter(childId)}className="userContainer">
        <div className="userPictureBox">
            <div className="userPicture" 
            style={{backgroundImage:"url("+picture+")"}}/>
            
        </div>
        <div className="userInformation">
            <div className="userText">
                <div className="userName">{name}</div>
                <div className="userLastMessage"style={{color:activeMessageColor}}>{message}</div>
            </div>
        </div>
        <div className="userTime">
            <div className="timeStamp" style={{color:activeTimeColor}}>{date}</div>
            <div className="unreadMessage">
                {counter!==0&&<div className="unreadMessageCount">{counter}</div>}
            </div>
        </div>
      </div>
    )
  }