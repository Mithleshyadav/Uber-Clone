

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import "leaflet/dist/leaflet.css";
import { BrowserRouter } from "react-router-dom";

import UserContextProvider from "./context/UserContext.jsx";
import CaptainContextProvider from "./context/CaptainContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* GLOBAL CONTEXTS */}
      <UserContextProvider>
        <CaptainContextProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </CaptainContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);
