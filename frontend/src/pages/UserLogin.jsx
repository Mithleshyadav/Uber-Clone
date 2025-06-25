import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate();
    const {user, setUser} = useContext(UserDataContext)
  
 
  const submitHandler = async (e) =>{
    e.preventDefault();
    const userData = {
      email: email,
      password: password
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
    

    if(response.status === 201){
     const data = response.data
     
     setUser(data.user)
     localStorage.setItem('token', data.token)
     navigate('/home')
    }
    
    setEmail('')
    setPassword('')
  }



  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
      <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />

      <form onSubmit={(e)=>{submitHandler(e)}}>
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input required className ='bg[#eeeeee] rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base ' 
        value={email} 
        onChange={(e)=>{setEmail(e.target.value)}}
        type="email" placeholder='email@example.com' />
        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
        <input required className ='bg[#eeeeee] rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base ' 
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
        type="password" placeholder='password' />
        <button className='w-full bg-[#111] text-white rounded font-semibold mt-2 px-4 py-2 text-lg placeholder:text-base'>Login</button>

      </form>
        <p className='text-center mt-3'> New here?<Link to='/signup' className='text-blue-600'>Create Account</Link></p>
      </div>
      <div>
        <Link to='/captain-login'  className='flex items-center justify-center w-full bg-[rgb(152,175,21)] text-white rounded font-semibold  px-4 py-2 text-lg placeholder:text-base'>Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin
