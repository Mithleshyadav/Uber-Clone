// // import React, { useRef, useState, useEffect, useContext } from "react";
// // import { Link } from "react-router-dom";
// // import CaptainDetails from "../components/CaptainDetails";
// // import RidePopUp from "../components/RidePopUp";
// // import ConfirmRidePopUp from "../components/ConfirmRidePopUp";

// // import { SocketContext } from "../context/SocketContext";
// // import { CaptainDataContext } from "../context/CaptainContext";
// // import axios from "axios";
// // import gsap from "gsap";

// // const CaptainHome = () => {
// //   const ridePopupPanelRef = useRef(null);
// //   const confirmRidePopupPanelRef = useRef(null);
// //   const [ridePopupPanel, setRidePopupPanel] = useState(false);
// //   const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
// //   const [ride, setRide] = useState(null);

// //   const { socket } = useContext(SocketContext);
// //   const { captain } = useContext(CaptainDataContext);

// //   // ✅ Prevent running socket logic if captain is not yet loaded
// //   useEffect(() => {
// //     if (!socket || !captain?._id) return;

// //     socket.emit("join", {
// //       userId: captain._id,
// //       userType: "captain",
// //     });

// //     const updateLocation = () => {
// //       if (navigator.geolocation) {
// //         navigator.geolocation.getCurrentPosition((position) => {
// //           socket.emit("update-location-captain", {
// //             userId: captain._id,
// //             location: {
// //               lat: position.coords.latitude,
// //               lng: position.coords.longitude,
// //             },
// //           });
// //         });
// //       }
// //     };

// //     const locationInterval = setInterval(updateLocation, 10000);
// //     updateLocation();

// //     return () => {
// //       clearInterval(locationInterval);
// //     };
// //   }, [socket, captain]);

// //   useEffect(() => {
// //     if (!socket) return;

// //     const handleNewRide = (data) => {
// //       setRide(data);
// //       setRidePopupPanel(true);
// //     };

// //     socket.on("newRide", handleNewRide);

// //     return () => {
// //       socket.off("newRide", handleNewRide);
// //     };
// //   }, [socket]);

// //   async function confirmRide() {
// //     if (!ride || !captain?._id) return;

// //     const response = await axios.post(
// //       `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
// //       {
// //         rideId: ride._id,
// //         captain: captain._id,
// //       },
// //       {
// //         withCredentials: true,
// //       }
// //     );
// //     console.log("Confirm ride response:", response.data);
// //     setRidePopupPanel(false);
// //     setConfirmRidePopupPanel(true);
// //   }

// //   useEffect(() => {
// //     if (ridePopupPanel) {
// //       gsap.to(ridePopupPanelRef.current, {
// //         transform: "translateY(0)",
// //       });
// //     } else {
// //       gsap.to(ridePopupPanelRef.current, {
// //         transform: "translateY(100%)",
// //       });
// //     }
// //   }, [ridePopupPanel]);

// //   useEffect(() => {
// //     if (confirmRidePopupPanel) {
// //       gsap.to(confirmRidePopupPanelRef.current, {
// //         transform: "translateY(0)",
// //       });
// //     } else {
// //       gsap.to(confirmRidePopupPanelRef.current, {
// //         transform: "translateY(100%)",
// //       });
// //     }
// //   }, [confirmRidePopupPanel]);

// //   // ✅ Add this condition before rendering CaptainDetails
// //   if (!captain) {
// //     return (
// //       <div className="h-screen flex items-center justify-center">
// //         <p className="text-gray-600 text-lg font-medium">
// //           Loading captain details...
// //         </p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="h-screen">
// //       <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
// //         <img
// //           className="w-16"
// //           src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
// //           alt=""
// //         />
// //         <Link
// //           to="/captain-home"
// //           className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
// //         >
// //           <i className="text-lg font-medium ri-logout-box-r-line"></i>
// //         </Link>
// //       </div>
// //       <div className="h-3/5">
// //         <img
// //           className="h-full w-full object-cover"
// //           src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
// //           alt=""
// //         />
// //       </div>
// //       <div className="h-2/5 p-6">
// //         <CaptainDetails />
// //       </div>
// //       <div
// //         ref={ridePopupPanelRef}
// //         className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
// //       >
// //         <RidePopUp
// //           ride={ride}
// //           setRidePopupPanel={setRidePopupPanel}
// //           setConfirmRidePopupPanel={setConfirmRidePopupPanel}
// //           confirmRide={confirmRide}
// //         />
// //       </div>
// //       <div
// //         ref={confirmRidePopupPanelRef}
// //         className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
// //       >
// //         <ConfirmRidePopUp
// //           ride={ride}
// //           setConfirmRidePopupPanel={setConfirmRidePopupPanel}
// //           setRidePopupPanel={setRidePopupPanel}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default CaptainHome;

// import React, { useRef, useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import CaptainDetails from "../components/CaptainDetails";
// import RidePopUp from "../components/RidePopUp";
// import ConfirmRidePopUp from "../components/ConfirmRidePopUp";

// import { SocketContext } from "../context/SocketContext";
// import { CaptainDataContext } from "../context/CaptainContext";
// import axios from "axios";
// import gsap from "gsap";
// import toast, { Toaster } from "react-hot-toast";

// const CaptainHome = () => {
//   const ridePopupPanelRef = useRef(null);
//   const confirmRidePopupPanelRef = useRef(null);
//   const [ridePopupPanel, setRidePopupPanel] = useState(false);
//   const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
//   const [ride, setRide] = useState(null);

//   const { socket } = useContext(SocketContext);
//   const { captain } = useContext(CaptainDataContext);

//   useEffect(() => {
//     if (!socket || !captain?._id) return;

//     socket.emit("join", {
//       userId: captain._id,
//       userType: "captain",
//     });

//     const updateLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((position) => {
//           socket.emit("update-location-captain", {
//             userId: captain._id,
//             location: {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             },
//           });
//         });
//       }
//     };

//     const locationInterval = setInterval(updateLocation, 10000);
//     updateLocation();

//     return () => clearInterval(locationInterval);
//   }, [socket, captain]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleNewRide = (data) => {
//       setRide(data);
//       setRidePopupPanel(true);
//       toast.success("New ride request received!");
//     };

//     socket.on("newRide", handleNewRide);

//     return () => socket.off("newRide", handleNewRide);
//   }, [socket]);

//   async function confirmRide() {
//     if (!ride || !captain?._id) return;

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
//         {
//           rideId: ride._id,
//           captain: captain._id,
//         },
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.data?.success) {
//         toast.success(response.data.message || "Ride confirmed!");
//         setRidePopupPanel(false);
//         setConfirmRidePopupPanel(true);
//       } else {
//         toast.error(response.data?.message || "Failed to confirm ride");
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || error.message || "Something went wrong"
//       );
//     }
//   }

//   // Popup animations
//   useEffect(() => {
//     gsap.to(ridePopupPanelRef.current, {
//       transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [ridePopupPanel]);

//   useEffect(() => {
//     gsap.to(confirmRidePopupPanelRef.current, {
//       transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
//     });
//   }, [confirmRidePopupPanel]);

//   if (!captain) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <p className="text-gray-600 text-lg font-medium">
//           Loading captain details...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen">
//       <Toaster position="top-right" />
//       <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
//         <img
//           className="w-16"
//           src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
//           alt="Uber Logo"
//         />
//         <Link
//           to="/captain-home"
//           className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
//         >
//           <i className="text-lg font-medium ri-logout-box-r-line"></i>
//         </Link>
//       </div>
//       <div className="h-3/5">
//         <img
//           className="h-full w-full object-cover"
//           src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
//           alt="Ride Banner"
//         />
//       </div>
//       <div className="h-2/5 p-6">
//         <CaptainDetails />
//       </div>
//       <div
//         ref={ridePopupPanelRef}
//         className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <RidePopUp
//           ride={ride}
//           setRidePopupPanel={setRidePopupPanel}
//           setConfirmRidePopupPanel={setConfirmRidePopupPanel}
//           confirmRide={confirmRide}
//         />
//       </div>
//       <div
//         ref={confirmRidePopupPanelRef}
//         className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <ConfirmRidePopUp
//           ride={ride}
//           setConfirmRidePopupPanel={setConfirmRidePopupPanel}
//           setRidePopupPanel={setRidePopupPanel}
//         />
//       </div>
//     </div>
//   );
// };

// export default CaptainHome;


import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";

import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";

const CaptainHome = () => {
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // ✅ Only update location if socket & captain exist
  useEffect(() => {
    if (!socket || !captain?._id) return;

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    // Update immediately and then every 10s
    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);

    return () => clearInterval(locationInterval);
  }, [socket, captain]);

  // ✅ Listen for new rides
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      setRide(data);
      setRidePopupPanel(true);
      toast.success("New ride request received!");
    };

    socket.on("newRide", handleNewRide);

    return () => socket.off("newRide", handleNewRide);
  }, [socket]);

  // ✅ Confirm ride function
  async function confirmRide() {
    if (!ride || !captain?._id) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
        {
          rideId: ride._id,
          captain: captain._id,
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Ride confirmed!");
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
      } else {
        toast.error(response.data?.message || "Failed to confirm ride");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }

  // ✅ Animate ride popup
  useEffect(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ridePopupPanel]);

  // ✅ Animate confirm ride popup
  useEffect(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePopupPanel]);

  // ✅ Wait for captain to load before rendering UI
  if (!captain) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg font-medium">
          Loading captain details...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Toaster position="top-right" />
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Ride Banner"
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
