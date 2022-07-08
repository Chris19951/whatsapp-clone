import{
  AnnotationIcon,
  DotsVerticalIcon,
  RefreshIcon,
  SearchIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon
}from '@heroicons/react/solid'
import{
  PaperClipIcon,
  EmojiHappyIcon,
  ChevronDownIcon,
  PencilIcon,
  ArrowDownIcon,
}from '@heroicons/react/outline'
import ProfilComponent from "../components/UserProfil"
import ChatBoobleComponent from "../components/ChatBooble"
import {useAuth} from "../contexts/AuthContext";
import React ,{useState,useEffect,useRef,useCallback} from "react";
import {onValue,query,ref,orderByChild,off} from "firebase/database";
import {db,auth,refStorage,storage} from "../firebase";
import {
  pushMessage,
  pushMessageOther,
  setMyLastMessage,
  setThereLastMessage,
  updateUserPicture,
  updateUsername
}from "../contexts/Database"
import {useDropzone} from 'react-dropzone'
import {uploadBytesResumable,getDownloadURL } from "firebase/storage";

export default function Mainpage() {
  //reference for the input values
  const chatInput = useRef()
  const filterInput = useRef()
  const chatSide  = useRef(null)
  const usernameRef = useRef()
  //create states
  const [userList,setUserList] = useState([])
  const [chat,setChat] = useState([])
  const [user,setUser] = useState([])
  const [oponentUser,setOponentUser] = useState(false)
  const [changeProfil,setChangeProfil] = useState(false)
  const [scrollButton,setScrollButton] = useState(false)
  const [selectedImages,setSelectedImages] = useState()
  const [error,setError] = useState()
  const [selectedImage,setSelectedImage] = useState()
  const [filterValue,setFilterValue] = useState("")
  //create auth and get own user
  const {logout} = useAuth()
  const userId = auth.currentUser.uid
  //firebase storage ref
  const storageRef = refStorage(storage,userId)
  //on drop save URL in state
  const onDrop = useCallback(acceptedFiles => {
    setSelectedImages(acceptedFiles[0])
    setSelectedImage(URL.createObjectURL(acceptedFiles[0]))
  })
  //root for dropdown
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  //accepted datatypes for dropdown
  const metadata = {contentType: 'image/jpeg'};
  //upload handler
  function handleUpload(){
    const uploadTask = uploadBytesResumable(storageRef, selectedImages, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',(snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      switch (snapshot.state) {
        case 'paused':
          break;
        case 'running':
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
      case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
      case 'storage/canceled':
      // User canceled the upload
      break;
      // ...
      case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
      }
    },() => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        updateUserPicture(downloadURL)
        setSelectedImages()
        setSelectedImage()
      });
    }
  )
 }
  //submithandler
  //logouthandler
  async function handleLogout(e) {
    //prevent reload
    e.preventDefault()
    //call Logout
    await logout()
  }
  //scroll the chatbox down
  const scrollToBottom = () => {
    chatSide.current.scrollIntoView({ top: 0, behavior: 'instant',})
  }
//create a Button to scroll down
//if its not scrolled down
function createButton(){
  const chatSide = document.querySelector(".chatAreaChatSide")
  if(chatSide.scrollTop  < chatSide.scrollHeight-880){
      setScrollButton(true)
  }
  else{
      setScrollButton(false)
  }  
}
//change the Inputfield sign
function changeSign() {
  const searchSign = document.querySelector(".searchIconInput")
  const arrowSign = document.querySelector(".arrowIconChatUsers")
  arrowSign.classList.toggle("active")
  searchSign.classList.toggle("active")
}
  //save chat handler
  var handleMessage = event =>{
    //prevent reload
    event.preventDefault()
    //if input isnt empty
    if((chatInput.current.value)!=""){
      //push the messgae in all dbs needed
      pushMessage(chatInput.current.value,oponentUser.user_id)
      pushMessageOther(chatInput.current.value,oponentUser.user_id)
      setMyLastMessage(chatInput.current.value,oponentUser.user_id)
      setThereLastMessage(chatInput.current.value,oponentUser.user_id)
      //reset chatinput to zero
      chatInput.current.value="" 
    }
  }
  //handle user filter input
  var handleFilter = event =>{
    event.preventDefault()
    if((filterInput.current.value)!=""){
        setFilterValue(filterInput.current.value)
    }else{
        setFilterValue("")
    }
}
  //handle change of opponentUser
  function changeOpponent(child){
      setOponentUser(child)
  }
  //Handler for change the username
  const onChangeUserName = (e) => {
    e.preventDefault();
    if ((usernameRef.current.value.length>=10)||(usernameRef.current.value.length<=3)){
      if(usernameRef.current.value.length>=10){
        return setError("The username can not be bigger than 10 letters!")
      }
      if(usernameRef.current.value.length<=3){
        return setError("The username can not be smaller than 3 letters!")
      }
    }else{
      setError()
      updateUsername(usernameRef.current.value)
    } 
  }
  //useEffect for generating the Userlist
  useEffect(() => {
    //OnValue on the userstable
    onValue(query(ref(db,'Users/'),orderByChild('user_chats/'+userId+'/timeLastMessage')),(snapshot) =>{
      setUserList([])
      //if an snapshot exists
      if(snapshot.hasChildren()){
        //for each user
        snapshot.forEach(child=>{
          //add user to list
          //filter the own user
          if(userId!==child.val().user_id){
            //if filterValue have default state
            if(filterValue === ""){
              setUserList(userList =>[...userList,child.val()])
            }else{
              //if filter value istn default
              //if db entry of user includes the filter input
              if(child.val().user_name.includes(filterValue)){
                setUserList(userList =>[...userList,child.val()])
              }
            }
          }
        })
      }
    }) 
  }, [filterValue])
  //useEffect for Scrollbar
  useEffect(() => {
    // scroll to bottom every time messages change
    chatSide.current?.scrollIntoView();
  }, [oponentUser,chat]);
  //useEffect for generating the own user
  useEffect(() => {
    //OnValue on the my user
    onValue(ref(db,'Users/'+userId),(snapshot) =>{
      //if an snapshot exists
      if(snapshot.hasChildren()){
        setUser(snapshot.val())
      }
    }) 
  }, [])
  //useEffect for generating chat
  useEffect(() => {
    //OnValue on the chatstable
    if(oponentUser){
      onValue(ref(db,'chats/'+userId+oponentUser.user_id),(snapshot) =>{
        setChat([])
        //if an snapshot exists
        if(snapshot.exists()){
          //add child to chat list
          setChat(Object.values(snapshot.val()).slice(-100))
        }
      })
    }
    return () => {
      off(ref(db,'chats/'+userId+oponentUser.user_id))
    }
  }, [oponentUser])
  //main Return
  return (
    <div className="mainpageContainer">
      <div className="chatContainer">
        {!changeProfil&&<div className="profilSide">
          <div className="topAreaProfilSide">
            <div className="myProfilPictureBox">
              <div className="myProfilPicture" onClick={() => setChangeProfil(true)}
              style={{backgroundImage:"url("+user.user_picture+")"}}/>
            </div>
            <div className="myProfilButtonsBox">
              <div className='iconBox'>
                <RefreshIcon className="icon"/>
              </div>
              <div className='iconBox'>
                <AnnotationIcon className="icon"/>
              </div>
              <div className='iconBox'>                
                <DotsVerticalIcon onClick={handleLogout} className="icon"/>
              </div>
            </div>
          </div>
          <div className="middleAreaProfilSide">
            <ArrowDownIcon className='arrowIconChatUsers'/>
            <SearchIcon className='searchIconInput'/>
            <input ref={filterInput} type="text" className="inputProfilSide" 
              placeholder="Search for Chat"
              autoComplete='off' spellCheck='false'
              autoCorrect='off'              
              onFocus={changeSign}
              onBlur={changeSign}
              onKeyUp={handleFilter}/>
          </div>
          <div className="bottomAreaProfilSide">
            {userList&&userList.reverse().map(child=>
              <div key={child.user_id} onClick={() =>changeOpponent(child)}>
                <ProfilComponent name={child.user_name} lastMessage={child.user_chats}
                picture={child.user_picture} childId={child.user_id} opponentId={oponentUser.user_id}/>
              </div>
            )}
          </div>
        </div>}
        {changeProfil&&<div className="changeProfil">
          <div className="changeProfilTop">
              <ArrowLeftIcon onClick={() => setChangeProfil(false)} className='iconToggleProfil'/>
              <p className="profilText">Profil</p>
          </div>
          <div className="changeProfilBottom">
              <div className="profilImageBox">
                <div style={selectedImage?{
                  backgroundImage:"url("+selectedImage+")"}:{backgroundImage:"url("+user.user_picture+")"}}
                  className="profilImage" {...getRootProps()}> 
                 <input {...getInputProps()}/>
                </div>
                {selectedImage&&<div onClick={handleUpload} className="uploadButton" >Upload</div>}
              </div>
              <div className="profilNameBox">
                <p className='greenNameTag'>Your Name</p>
                <form id='formId' onSubmit={onChangeUserName}>
                  <input ref={usernameRef} className='profilName' placeholder={user.user_name}
                  autoComplete='off' spellCheck='false' 
                  autoCorrect='off'/>
                  <PencilIcon 
                  className='pencilIcon'
                  onClick={onChangeUserName}/>
                </form>
                {error&&<p className='profilChangeText'>{error}</p>}
                <p className='profilChangeText'>This is your username and not your PIN-code This is the name for your contacts</p>
              </div>
              <div className="fillerBox"></div>
          </div>
        </div>}
        {oponentUser&&<div className="chatSide">
          <div className="topAreaChatSide">
            <div className="opponentProfilPictureBox">
              <div className="myProfilPicture" 
              style={{backgroundImage:"url("+oponentUser.user_picture+")"}}/>
               <div className="opponentName">
                {oponentUser.user_name}
              </div>
            </div>
            <div className="buttonChatSideTop">
              <div className='iconBox'>
                <SearchIcon className="icon"/>
              </div>
              <div className='iconBox'>
                <DotsVerticalIcon className="icon"/>
              </div>
            </div>
          </div>
          <div className="chatAreaChatSide" onScroll={createButton} style={{backgroundImage:"url(/Desktop.webp)"}}>
          {scrollButton&&<div onClick={scrollToBottom} className="scrollButton"><ChevronDownIcon className="arrowDown"/></div>}
          {chat&&chat.map((child,index)=>
              <div key={index}>
                <ChatBoobleComponent textInput={child.content}
                context={child.id} time={child.date}/>
              </div>
            )}
              <div ref={chatSide} />
            </div>
          <div className="bottomAreaChatSide">
            <div className="smileyBox">
              <div className='sendIconBox'>
                <EmojiHappyIcon className="iconSmiley"/>
              </div>
              <div className='sendIconBox'>
                <PaperClipIcon className="iconSmiley"/>
              </div>
            </div>
            <form onSubmit={handleMessage} className="chatInputBox">
              <input ref={chatInput} type="text" className="inputChat" 
              placeholder="Write your Message"
              autoComplete='off' spellCheck='false' 
              autoCorrect='off'/>
            </form>
            <div className="sendButton">
              <div onClick={handleMessage}>
                <PaperAirplaneIcon className="iconSend"/>
              </div>
            </div>
          </div>
        </div>}
        {!oponentUser&&<div className="chatSideNoOpponentId">
          <img src="/noChatPicture.PNG"></img>
          <p className="titleClone">WhatsClone Web</p>
          <p className="text">Send and get messages withouth the need to be online<br></br>
          use WhatsClone on more then one device<br></br><br></br><br></br></p>
        </div>}
      </div>
    </div>
  )
}

