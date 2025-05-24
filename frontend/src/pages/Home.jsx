import React, { useState,useRef } from "react";
import "remixicon/fonts/remixicon.css";
 
 import gsap from 'gsap'
const Home = () => {
  const [ pickup, setPickup ] = useState('')
  const [ destination, setDestination ] = useState('')
  const [ panelOpen, setPanelOpen ] = useState(false)
const panelCloseRef = useRef(null)




  return (
    <div h-screen relative overflow-hidden>
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      {/* container */}
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className=" h-[33%] p-6 relative">
          <h5 ref= {panelCloseRef} onclick= {() =>{setPanelOpen(false)}} className=" absolute  right-6 top-6 text-2xl">
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form className="relative py-3">
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
             onClick={() => {
              setPanelOpen(true)
              setActiveField('pickup')
             }}
             value= {pickup}
             onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-full w-full "
              type="text"
              placeholder="Add a pick-up location"
            />

            <input
            onClick={() => {
              setPanelOpen(true)
              setActiveField('destination')
             }}
             value= {destination}
             onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-full w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
            Find Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
