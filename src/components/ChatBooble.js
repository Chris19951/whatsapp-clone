import {auth} from "../firebase";

export default function ChatBooble({context,textInput,time}) {
  //get own userid
  const userId = auth.currentUser.uid
  //Ask is this Message from me?
  //So we can sepperate between
  if (context===userId){
    context="incoming"
  }
  //If the message is not mine
  //call the first div
  //else call the outcoming
  return (context=="incoming")?(
    <div className="chatBoobleIncoming">
      <div className="chatContentIncoming">
        <div className="textIncoming">
          <p>{textInput}</p>
        </div>
        <div className='chatInfo'>
          <div>{time}</div>
        </div>
      </div>
    </div>
) :(
    <div className="chatBoobleOutgoing">
      <div className="chatContentOutgoing">
        <div className="textIncoming">
          <p>{textInput}</p>
        </div>
        <div className='chatInfo'>
          <div>{time}</div>
        </div>
      </div>
    </div>
)
}