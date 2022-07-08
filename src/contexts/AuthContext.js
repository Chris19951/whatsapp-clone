import React, {useContext, useState, useEffect} from "react"
import {auth} from "../firebase"
import  {writeUserData} from "../contexts/Database"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  
async function signup(email, password, username, url) {
    return auth.createUserWithEmailAndPassword(email, password).then(()=> {
      writeUserData(username, email, url)
    })
  }
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
    
  }
  function logout() {
    return auth.signOut()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}