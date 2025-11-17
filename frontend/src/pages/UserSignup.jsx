import React ,{ useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'
import toast from "react-hot-toast";

const UserSignup = () => {
 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')   
  const [firstName, setFirstName] = useState('')    
  const [lastName, setLastName] = useState('')
  
  

  const navigate = useNavigate();
   
   const submitHandler = async (e) => {
  e.preventDefault();

  const newUser = {
    fullname: { firstname: firstName, lastname: lastName },
    email,
    password,
  };

  // Show loading toast
  const toastId = toast.loading("Registering user...");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser,
      { withCredentials: true } // only if backend uses cookies
    );

    // ✅ Backend sends { success: true, message } on success
    if (response.data?.success) {
      toast.success(response.data.message || "Successfully registered");
      navigate("/login"); // redirect to login
    } else {
      // If backend returns success: false (rare)
      toast.error(response.data?.message || "Registration failed");
    }
  } catch (error) {
    // ✅ Handle backend ApiError and network errors
    const backendMessage = error?.response?.data?.message;
    const backendErrors = error?.response?.data?.errors;

    if (backendMessage) {
      toast.error(backendMessage);
    }

    // Optional: show validation errors as separate toasts
    if (Array.isArray(backendErrors) && backendErrors.length > 0) {
      backendErrors.forEach((err) => {
        toast.error(err.msg || JSON.stringify(err));
      });
    }

    // If network or unknown error
    if (!backendMessage && !backendErrors) {
      toast.error(error.message || "Something went wrong. Please try again");
    }
  } finally {
    toast.dismiss(toastId);

    // Clear form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  }
};

  
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
      <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />

      <form onSubmit={(e)=>{submitHandler(e)}}>
        <h3 className='text-lg font-base mb-2'>What's your name</h3>
        <div className='flex justify-between gap-4 mb-5'>

        <input
         value={firstName}
         onChange = {(e)=>{setFirstName(e.target.value)}}
         required className ='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base ' 
        type="text" placeholder='First name' />

        <input
        value={lastName}
        onChange={(e)=>{setLastName(e.target.value)}}
         className ='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base ' 
        type="text" placeholder='Last name' />

        </div>
        <h3 className='text-lg font-base mb-2'>What's your email</h3>
        <input required className ='bg[#eeeeee] rounded mb-5 px-4 py-2 border w-full text-lg placeholder:text-base ' 
        value={email} 
        onChange={(e)=>{setEmail(e.target.value)}}
        type="email" placeholder='email@example.com' />

        <h3 className='text-lg font-base mb-2'>Enter Password</h3>
        <input required className ='bg[#eeeeee] rounded mb-5 px-4 py-2 border w-full text-lg placeholder:text-base ' 
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
        type="password" placeholder='password' />

        <button className='w-full bg-[#111] text-white rounded font-semibold px-4 py-2 text-lg placeholder:text-base'>Create account </button>

      </form>
        <p className='text-center mt-3'> Already have an Account?<Link to='/login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <p className='text-[10px] leading-light'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span></p>
      </div>
    </div>
  )
}

export default UserSignup
