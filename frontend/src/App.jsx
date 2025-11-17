// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import "remixicon/fonts/remixicon.css";

// import Start from "./pages/Start";
// import Home from "./pages/Home";
// import UserLogin from "./pages/UserLogin";
// import UserSignup from "./pages/UserSignup";
// import CaptainSignup from "./pages/CaptainSignup";
// import CaptainLogin from "./pages/CaptainLogin";

// import UserProtectWrapper from "./pages/UserProtectWrapper";
// import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";

// import UserLogout from "./pages/UserLogout";
// import CaptainLogout from "./pages/CaptainLogout";
// import CaptainHome from "./pages/CaptainHome";
// import Riding from "./pages/Riding";
// import CaptainRiding from "./pages/CaptainRiding";

// import UserContext from "./context/UserContext.jsx";
// import CaptainContext from "./context/CaptainContext.jsx";

// import { Toaster } from "react-hot-toast";

// const App = () => {
//   return (
//     <>
//       <Toaster position="top-center" reverseOrder={false} />

//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/" element={<Start />} />
//         <Route path="/login" element={<UserLogin />} />
//         <Route path="/signup" element={<UserSignup />} />
//         <Route path="/captain-login" element={<CaptainLogin />} />
//         <Route path="/captain-signup" element={<CaptainSignup />} />

//         {/* USER ROUTES WRAPPED INSIDE USER CONTEXT */}
//         <Route
//           path="/home"
//           element={
//             <UserContext>
//               <UserProtectWrapper>
//                 <Home />
//               </UserProtectWrapper>
//             </UserContext>
//           }
//         />

//         <Route
//           path="/user/logout"
//           element={
//             <UserContext>
//               <UserProtectWrapper>
//                 <UserLogout />
//               </UserProtectWrapper>
//             </UserContext>
//           }
//         />

//         {/* CAPTAIN ROUTES WRAPPED INSIDE CAPTAIN CONTEXT */}
//         <Route
//           path="/captain-home"
//           element={
//             <CaptainContext>
//               <CaptainProtectWrapper>
//                 <CaptainHome />
//               </CaptainProtectWrapper>
//             </CaptainContext>
//           }
//         />

//         <Route
//           path="/captain/logout"
//           element={
//             <CaptainContext>
//               <CaptainProtectWrapper>
//                 <CaptainLogout />
//               </CaptainProtectWrapper>
//             </CaptainContext>
//           }
//         />

//         <Route
//           path="/riding"
//           element={
//             <UserContext>
//               <Riding />
//             </UserContext>
//           }
//         />

//         <Route
//           path="/captain-riding"
//           element={
//             <CaptainContext>
//               <CaptainRiding />
//             </CaptainContext>
//           }
//         />
//       </Routes>
//     </>
//   );
// };

// export default App;



import React from "react";
import { Routes, Route } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import Start from "./pages/Start";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin";

import UserProtectWrapper from "./pages/UserProtectWrapper";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";

import UserLogout from "./pages/UserLogout";
import CaptainLogout from "./pages/CaptainLogout";
import CaptainHome from "./pages/CaptainHome";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />

        {/* USER PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />

        {/* CAPTAIN PROTECTED ROUTES */}
        <Route
          path="/captain-home"
          element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          }
        />

        <Route
          path="/captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />

        {/* OTHER ROUTES */}
        <Route
          path="/riding"
          element={
            <UserProtectWrapper>
              <Riding />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/captain-riding"
          element={
            <CaptainProtectWrapper>
              <CaptainRiding />
            </CaptainProtectWrapper>
          }
        />
      </Routes>
    </>
  );
};

export default App;
