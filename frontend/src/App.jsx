import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSignup';
import CaptainLogin from './pages/CaptainLogin';
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import CaptainHome from './pages/CaptainHome'


const App = () => {
 
  return (
    <div>
     <Routes>
      <Route path='/' element={<Start />} />
      <Route path='/home' element={<UserProtectWrapper> <Home /> </UserProtectWrapper>} />
      <Route path='/login' element={<UserLogin />}  />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path='/user/logout' element={<UserProtectWrapper>
        <UserLogout/>
      </UserProtectWrapper>}/>
      <Route path='/captain/logout' element={<CaptainProtectWrapper>
        <CaptainLogout/>
      </CaptainProtectWrapper>}/>
      <Route path='/captain-home' element={<CaptainProtectWrapper>
        <CaptainHome/>
      </CaptainProtectWrapper>}/>

     </Routes>
    </div>
  )
}

export default App
