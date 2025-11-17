import React, {useState,useContext} from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import toast from "react-hot-toast";


const CaptainSignup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newCaptain = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
    };

    // 🌀 Show loading toast
    const toastId = toast.loading("Registering captain...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        newCaptain,
        { withCredentials: true }
      );

      // ✅ Backend success case
      if (response.data?.success) {
        toast.success(response.data.message || "Captain registered successfully!");
        navigate("/captain-login"); // redirect to login after success
      } else {
        toast.error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      // 🚨 Handle validation + generic errors
      const backendMessage = error?.response?.data?.message;
      const backendErrors = error?.response?.data?.errors;

      if (backendMessage) {
        toast.error(backendMessage);
      }

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          toast.error(err.msg || JSON.stringify(err));
        });
      }

      if (!backendMessage && !backendErrors) {
        toast.error(error.message || "Something went wrong. Please try again");
      }
    } finally {
      toast.dismiss(toastId);

      // 🧹 Clear form fields
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
    }
  };



  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
    <div>
    <img className='w-16 mb-10' src="https://pngimg.com/d/uber_PNG24.png" alt="" />


    <form onSubmit={(e)=>{submitHandler(e)}}>
      <h3 className='text-lg font-base mb-2'>What's our Captain's name</h3>
      <div className='flex justify-between gap-4 mb-5'>

      <input
       value={firstname}
       onChange = {(e)=>{setFirstName(e.target.value)}}
       required className ='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base ' 
      type="text" placeholder='First name' />

      <input
      value={lastname}
      onChange={(e)=>{setLastName(e.target.value)}}
       className ='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base ' 
      type="text" placeholder='Last name' />

      </div>
      <h3 className='text-lg font-base mb-2'>What's our captain's email</h3>
      <input required className ='bg[#eeeeee] rounded mb-5 px-4 py-2 border w-full text-lg placeholder:text-base ' 
      value={email} 
      onChange={(e)=>{setEmail(e.target.value)}}
      type="email" placeholder='email@example.com' />

      <h3 className='text-lg font-base mb-2'>Enter Password</h3>
      <input required className ='bg[#eeeeee] rounded mb-5 px-4 py-2 border w-full text-lg placeholder:text-base ' 
      value={password}
      onChange={(e)=>{setPassword(e.target.value)}}
      type="password" placeholder='password' />

      <h3 className='text-lg font-base mb-2'>Vehicle Details</h3>
      <div className='flex justify-between gap-4 mb-5'>
        <input
          value={vehicleColor}
          onChange={(e)=>{setVehicleColor(e.target.value)}}
          required
          className='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
          type="text"
          placeholder='Vehicle Color'
        />
        <input
          value={vehiclePlate}
          onChange={(e)=>{setVehiclePlate(e.target.value)}}
          required
          className='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
          type="text"
          placeholder='Vehicle Plate Number'
        />
      </div>

      <div className='flex justify-between gap-4 mb-5'>
        <input
          value={vehicleCapacity}
          onChange={(e)=>{setVehicleCapacity(e.target.value)}}
          required
          className='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
          type="number"
          placeholder='Vehicle Capacity'
        />
        <select
          value={vehicleType}
          onChange={(e)=>{setVehicleType(e.target.value)}}
          required
          className='bg[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
        >
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="auto">Auto</option>
          <option value="motorcycle">Motorcycle</option>
        </select>
      </div>

      <button className='w-full bg-[#111] text-white rounded font-semibold px-4 py-2 text-lg placeholder:text-base'>Create Captain</button>

    </form>
      <p className='text-center mt-3'> Already have an Account?<Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
    </div>
    <div>
      <p className='text-[10px] leading-light'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span></p>
    </div>
  </div>
  )
}

export default CaptainSignup
