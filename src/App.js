import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {AuthProvider} from "./contexts/AuthContext"
import PrivateRoute from "./contexts/PrivateRoute"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Mainpage from "./pages/Mainpage"

function App() {
  return (
    <div className='appContainer'>
      <Router> 
        <AuthProvider> 
          <Routes>
            <Route path="/"element={<PrivateRoute><Mainpage/></PrivateRoute>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </AuthProvider> 
      </Router> 
    </div>
  );
}

export default App;
