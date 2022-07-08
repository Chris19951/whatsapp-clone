import {Link,useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useRef,useState} from "react";

export default function Signup() {
  //create reference for inputs
  const emailRef = useRef()
  const usernameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  //create navigate
  const history = useNavigate()
  //create states
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  //getAuth
  const { signup } = useAuth()
  //submit-handler
  async function handleSubmit(e) {
    e.preventDefault()
    //ask if the inputs are valid
    if ((passwordRef.current.value !== passwordConfirmRef.current.value)||
    (usernameRef.current.value.length>=10)||
    (usernameRef.current.value.length<=3)||
    (emailRef.current.value.length<=3)||
    (emailRef.current.value.length>=40)||
    (passwordRef.current.value.length<=8)||
    (passwordRef.current.value.length>=50)
    ){//set error if password isnt valid
      if(passwordRef.current.value !== passwordConfirmRef.current.value){
        return setError("Password do not match!")
      }
      if(usernameRef.current.value.length>=10){
        return setError("The username can not be bigger than 10 letters!")
      }
      if(usernameRef.current.value.length<=3){
        return setError("The username can not be smaller than 3 letters!")
      }
      if(emailRef.current.value.length<=3){
        return setError("The email can not be smaller than 3 letters!")
      }
      if(emailRef.current.value.length>=40){
        return setError("The email can not be bigger than 40 letters!")
      }
      if(passwordRef.current.value.length<=8){
        return setError("The password can not be smaller than 8 letters!")
      }
      if(passwordRef.current.value.length>=50){
        return setError("The password is to big")
      }
    }else{//If all Inputs are valid
      //reset the states
      setError("")
      setLoading(true)
      //call signup function
      await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value, "")
      //navigate into mainpage
      history("/") 
      } 
      //reset loadingstate
      setLoading(false) 
}

  return (
    <div className="signupContainer">
        <div className="signUpBox">
            <img src="/whatsapp-logo-icone-768x786.png"/>
            <p>Sign Up</p>
            {error && <div className="error"><p>{error}</p></div>}
            <form className="SignUpForm" onSubmit={handleSubmit}>   
                <input ref={usernameRef} type="text"  placeholder="Username" className="inputSignup"
                autoComplete='off' spellCheck='false' autoCorrect='off'/>
                <input ref={emailRef} type="email"  placeholder="Email" className="inputSignup"
                autoComplete='off' spellCheck='false' autoCorrect='off'/>
                <input ref={passwordRef} type="password"  placeholder="Password" className="inputSignup"
                autoComplete='off' spellCheck='false' autoCorrect='off'/>
                <input ref={passwordConfirmRef} type="password"  placeholder="Repeat Password" className="inputSignup"
                autoComplete='off' spellCheck='false' autoCorrect='off'/>
                <div>
                  <button disabled={loading} type="submit" className="sumbitButton">Sign Up</button>
                </div>
            </form>
            <div className="linkForm">
              <p>Already have an Account? <Link to ="/Login" className="link">Login</Link></p>
            </div>
        </div>
    </div>
  )
}