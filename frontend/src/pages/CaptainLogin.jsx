import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";


const CaptainLogin = () => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newCaptain = { email, password };

    // 🌀 Show loading toast
    const toastId = toast.loading("Logging in...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        newCaptain,
        { withCredentials: true }
      );

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Login failed");
        toast.dismiss(toastId);
        return;
      }

     
      toast.success(response?.data?.message || "Successfully logged in");
      toast.dismiss(toastId);

      localStorage.setItem("role", "captain");

      setTimeout(() => {
        navigate("/captain-home");
      }, 300);

    } catch (error) {
      toast.dismiss(toastId);

      const backendMessage = error?.response?.data?.message;
      const backendErrors = error?.response?.data?.errors;

      if (backendMessage) toast.error(backendMessage);
      else if (Array.isArray(backendErrors))
        backendErrors.forEach((err) => toast.error(err.msg || JSON.stringify(err)));
      else toast.error(error.message || "Something went wrong!");
    } finally {
    
      setEmail("");
      setPassword("");
    }
  };
 

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
