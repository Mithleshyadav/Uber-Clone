import React, { useState,useRef, useEffect } from "react";
import axios from 'axios'
import "remixicon/fonts/remixicon.css";
import gsap from "gsap";
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';

const Home = () => {
const [ pickup, setPickup ] = useState('')
const [ destination, setDestination ] = useState('')
const [ panelOpen, setPanelOpen ] = useState(false)
const panelRef = useRef(null)
const panelCloseRef = useRef(null)
const vehiclePanelRef = useRef(null)
const confirmRidePanelRef = useRef(null)
const [ activeField, setActiveField ] = useState('');
const [ pickupSuggestions, setPickupSuggestions ] = useState([])
const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
const [ vehiclePanel, setVehiclePanel ] = useState(false)
const [ confirmRidePanel, setConfirmRidePanel ] = useState('')
const [ vehicleType, setVehicleType ] = useState('')
const [fare, setFare ] = useState('')

const handlePickupChange = async (e) => {
         console.log(import.meta.env.VITE_BASE_URL)
        setPickup(e.target.value)
        console.log(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-autocomplete-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            console.log(response.data)
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        console.log("Fetching suggestions for:", e.target.value);
        
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-autocomplete-suggestions`, {
            params: { input: e.target.value },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          console.log("Received suggestions:", response.data);
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    async function findTrip() {
       setVehiclePanel(true)
        setPanelOpen(false)
    }
    useEffect(() => {
    if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
            transform: 'translateY(0)'
        });
    } else {
        gsap.to(vehiclePanelRef.current, {
            transform: 'translateY(100%)'
        });
    }
}, [vehiclePanel]);
       

useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  useEffect(() => {
    if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
            transform: 'translateY(0)'
        })
    } else {
        gsap.to(vehiclePanelRef.current, {
            transform: 'translateY(100%)'
        });
    }
}, [vehiclePanel]);



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
          <h5 ref= {panelCloseRef} onClick= {() =>{setPanelOpen(false)}} className=" absolute  right-6 top-6 text-2xl">
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
               onChange={(e) => {
            handlePickupChange(e);
  }}
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
              onChange={(e) => {
            handleDestinationChange(e);
  }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-full w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button 
          onClick={findTrip}
          className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
            Find Trip
          </button>
        </div>

       <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                       activeField={activeField}
                    />
                </div>
      </div>
     
    <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

    </div>
  );
};

export default Home;
