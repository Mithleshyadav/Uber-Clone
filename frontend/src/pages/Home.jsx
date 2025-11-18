import React, { useEffect, useRef, useState, useContext } from "react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });

    const handleRideConfirmed = (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    };

    const handleRideStarted = (ride) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
    };

    socket.on("rideConfirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("rideConfirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
    };
  }, [user, socket]);

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-autocomplete-suggestions`,
        {
          params: { input: e.target.value },
          withCredentials: true,
        },
      );
      setPickupSuggestions(response.data);
    } catch {}
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-autocomplete-suggestions`,
        {
          params: { input: e.target.value },
          withCredentials: true,
        }
      );
      setDestinationSuggestions(response.data);
    } catch {}
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
      });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelOpen]);

  useEffect(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, { transform: "translateY(0)" });
    } else {
      gsap.to(vehiclePanelRef.current, { transform: "translateY(100%)" });
    }
  }, [vehiclePanel]);

  useEffect(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, { transform: "translateY(0)" });
    } else {
      gsap.to(confirmRidePanelRef.current, { transform: "translateY(100%)" });
    }
  }, [confirmRidePanel]);

  useEffect(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, { transform: "translateY(0)" });
    } else {
      gsap.to(vehicleFoundRef.current, { transform: "translateY(100%)" });
    }
  }, [vehicleFound]);

  useEffect(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, { transform: "translateY(0)" });
    } else {
      gsap.to(waitingForDriverRef.current, { transform: "translateY(100%)" });
    }
  }, [waitingForDriver]);

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        withCredentials: true,
      },
      
    );
    setFare(response.data);
  }

  async function createRide() {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create-ride`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        withCredentials: true,
      }
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* MAP (background) */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <LiveTracking />
      </div>

      {/* MAIN FORM UI */}
      <div className="z-[100] absolute top-0 left-0 w-full h-full flex flex-col justify-end">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>

        {/* Location Suggestion Panel */}
        <div ref={panelRef} className="bg-white h-0 overflow-hidden">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      {/* Bottom Slide-Up Panels */}
      <div
        ref={vehiclePanelRef}
        className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;



// import React, { useEffect, useRef, useState, useContext } from "react";
// import gsap from "gsap";
// import axios from "axios";
// import "remixicon/fonts/remixicon.css";
// import LocationSearchPanel from "../components/LocationSearchPanel";
// import VehiclePanel from "../components/VehiclePanel";
// import ConfirmRide from "../components/ConfirmRide";
// import LookingForDriver from "../components/LookingForDriver";
// import WaitingForDriver from "../components/WaitingForDriver";
// import { SocketContext } from "../context/SocketContext";
// import { UserDataContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import LiveTracking from "../components/LiveTracking";
// import toast, { Toaster } from "react-hot-toast";

// const Home = () => {
//   const [pickup, setPickup] = useState("");
//   const [destination, setDestination] = useState("");
//   const [panelOpen, setPanelOpen] = useState(false);
//   const vehiclePanelRef = useRef(null);
//   const confirmRidePanelRef = useRef(null);
//   const vehicleFoundRef = useRef(null);
//   const waitingForDriverRef = useRef(null);
//   const panelRef = useRef(null);
//   const panelCloseRef = useRef(null);
//   const [vehiclePanel, setVehiclePanel] = useState(false);
//   const [confirmRidePanel, setConfirmRidePanel] = useState(false);
//   const [vehicleFound, setVehicleFound] = useState(false);
//   const [waitingForDriver, setWaitingForDriver] = useState(false);
//   const [pickupSuggestions, setPickupSuggestions] = useState([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState([]);
//   const [activeField, setActiveField] = useState(null);
//   const [fare, setFare] = useState({});
//   const [vehicleType, setVehicleType] = useState(null);
//   const [ride, setRide] = useState(null);

//   const navigate = useNavigate();
//   const { socket } = useContext(SocketContext);
//   const { user } = useContext(UserDataContext);

//   // ------------------------
//   // Socket setup
//   // ------------------------
//   useEffect(() => {
//     socket.emit("join", { userType: "user", userId: user._id });

//     const handleRideConfirmed = (ride) => {
//       setVehicleFound(false);
//       setWaitingForDriver(true);
//       setRide(ride);
//     };

//     const handleRideStarted = (ride) => {
//       setWaitingForDriver(false);
//       navigate("/riding", { state: { ride } });
//     };

//     socket.on("rideConfirmed", handleRideConfirmed);
//     socket.on("ride-started", handleRideStarted);

//     return () => {
//       socket.off("rideConfirmed", handleRideConfirmed);
//       socket.off("ride-started", handleRideStarted);
//     };
//   }, [user, socket]);


//    const handlePickupChange = async (e) => {
//     setPickup(e.target.value);
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/maps/get-autocomplete-suggestions`,
//         {
//           params: { input: e.target.value },
//           withCredentials: true,
//         },
//       );
//       setPickupSuggestions(response.data);
//     } catch {}
//   };

//   const handleDestinationChange = async (e) => {
//     setDestination(e.target.value);
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/maps/get-autocomplete-suggestions`,
//         {
//           params: { input: e.target.value },
//           withCredentials: true,
//         }
//       );
//       setDestinationSuggestions(response.data);
//     } catch {}
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();
//   };

  
//   useEffect(() => {
//     gsap.to(panelRef.current, {
//       height: panelOpen ? "70%" : "0%",
//       padding: panelOpen ? 24 : 0,
//     });
//     gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0 });
//   }, [panelOpen]);

//   useEffect(() => {
//     gsap.to(vehiclePanelRef.current, {
//       transform: vehiclePanel ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [vehiclePanel]);

//   useEffect(() => {
//     gsap.to(confirmRidePanelRef.current, {
//       transform: confirmRidePanel ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [confirmRidePanel]);

//   useEffect(() => {
//     gsap.to(vehicleFoundRef.current, {
//       transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [vehicleFound]);

//   useEffect(() => {
//     gsap.to(waitingForDriverRef.current, {
//       transform: waitingForDriver ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [waitingForDriver]);

  
//   async function findTrip() {
//     try {
//       setVehiclePanel(true);
//       setPanelOpen(false);

//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
//         {
//           params: { pickup, destination },
//           withCredentials: true,
//         }
//       );

//       setFare(response.data);
//       toast.success("Fare calculated");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to calculate fare"
//       );
//     }
//   }

  
//   async function createRide() {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/rides/create-ride`,
//         { pickup, destination, vehicleType },
//         { withCredentials: true }
//       );

//       if (response.data?.success) {
//         toast.success("Ride request sent");
//       } else {
//         toast.error(response.data?.message || "Failed to create ride");
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           error.message ||
//           "Ride creation failed"
//       );
//     }
//   }

//   return (
//     <div className="h-screen w-screen relative overflow-hidden">
//       <Toaster position="top-right" />

//       {/* MAP */}
//       <div className="absolute top-0 left-0 w-full h-full z-0">
//         <LiveTracking />
//       </div>

//       {/* MAIN FORM */}
//       <div className="z-[100] absolute top-0 left-0 w-full h-full flex flex-col justify-end">
//         <div className="h-[30%] p-6 bg-white relative">
//           <h5
//             ref={panelCloseRef}
//             onClick={() => setPanelOpen(false)}
//             className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
//           >
//             <i className="ri-arrow-down-wide-line"></i>
//           </h5>

//           <h4 className="text-2xl font-semibold">Find a trip</h4>

//           <form className="relative py-3" onSubmit={submitHandler}>
//             <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>

//             <input
//               onClick={() => {
//                 setPanelOpen(true);
//                 setActiveField("pickup");
//               }}
//               value={pickup}
//               onChange={handlePickupChange}
//               className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
//               type="text"
//               placeholder="Add a pick-up location"
//             />

//             <input
//               onClick={() => {
//                 setPanelOpen(true);
//                 setActiveField("destination");
//               }}
//               value={destination}
//               onChange={handleDestinationChange}
//               className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
//               type="text"
//               placeholder="Enter your destination"
//             />
//           </form>

//           <button
//             onClick={findTrip}
//             className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
//           >
//             Find Trip
//           </button>
//         </div>

//         {/* Location Panel */}
//         <div ref={panelRef} className="bg-white h-0 overflow-hidden">
//           <LocationSearchPanel
//             suggestions={
//               activeField === "pickup"
//                 ? pickupSuggestions
//                 : destinationSuggestions
//             }
//             setPanelOpen={setPanelOpen}
//             setVehiclePanel={setVehiclePanel}
//             setPickup={setPickup}
//             setDestination={setDestination}
//             activeField={activeField}
//           />
//         </div>
//       </div>

//       {/* Bottom Panels */}
//       <div
//         ref={vehiclePanelRef}
//         className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <VehiclePanel
//           selectVehicle={setVehicleType}
//           fare={fare}
//           setConfirmRidePanel={setConfirmRidePanel}
//           setVehiclePanel={setVehiclePanel}
//         />
//       </div>

//       <div
//         ref={confirmRidePanelRef}
//         className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
//       >
//         <ConfirmRide
//           createRide={createRide}
//           pickup={pickup}
//           destination={destination}
//           fare={fare}
//           vehicleType={vehicleType}
//           setConfirmRidePanel={setConfirmRidePanel}
//           setVehicleFound={setVehicleFound}
//         />
//       </div>

//       <div
//         ref={vehicleFoundRef}
//         className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
//       >
//         <LookingForDriver
//           createRide={createRide}
//           pickup={pickup}
//           destination={destination}
//           fare={fare}
//           vehicleType={vehicleType}
//           setVehicleFound={setVehicleFound}
//         />
//       </div>

//       <div
//         ref={waitingForDriverRef}
//         className="fixed z-[200] w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
//       >
//         <WaitingForDriver
//           ride={ride}
//           setVehicleFound={setVehicleFound}
//           setWaitingForDriver={setWaitingForDriver}
//           waitingForDriver={waitingForDriver}
//         />
//       </div>
//     </div>
//   );
// };

// export default Home;


