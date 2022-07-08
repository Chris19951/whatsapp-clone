import {Link,useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useRef,useState} from "react";

export default function Login() {
  //create reference for inputs
  const emailRef = useRef()
  const passwordRef = useRef()
  //create navigate
  const history = useNavigate()
  //create states
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  //getAuth
  const {login} = useAuth()
  //submit-handler
  async function handleSubmit(e) {
    //prevent reload
    e.preventDefault()
    //try if email and password match
    try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        history("/")
    //pw/email was wrong
    }catch{
        setError("Failed to login")
    }
    setLoading(false) 
}
    return (
        <div className="signupContainer">
            <div className="signUpBox">
                <img src="/whatsapp-logo-icone-768x786.png"/>
                <p>Login</p>
                {error && <div className="error"><p>{error}</p></div>}
                <form className="SignUpForm" onSubmit={handleSubmit}>   
                    <input ref={emailRef} type="email"  placeholder="Email" className="inputSignup"
                    autoComplete='off' spellCheck='false' autoCorrect='off'/>
                    <input ref={passwordRef} type="password"  placeholder="Password" className="inputSignup"
                    autoComplete='off' spellCheck='false' autoCorrect='off'/>
                    <div>
                        <button disabled={loading} type="submit" className="sumbitButton">Log In</button>
                    </div>
                </form>
                <div className="linkForm">
                    <p>Not have an Account? <Link to ="/Signup" className="link">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}