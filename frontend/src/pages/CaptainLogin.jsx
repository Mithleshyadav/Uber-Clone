import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [captainData, setCaptainData] = useState('')
 
  const submitHandler = (e) =>{
    e.preventDefault();
    setCaptainData({
      email: email,
      password: password
    })
    setEmail('')
    setPassword('')
  }



  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
      <img className='w-16 mb-10' src="https://pngimg.com/d/uber_PNG24.png" alt="" />

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
        <p className='text-center mt-3'> join a fleet?<Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link to='/login'  className='flex items-center justify-center w-full bg-[#e2a807] text-white rounded font-semibold  px-4 py-2 text-lg placeholder:text-base'>Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin
