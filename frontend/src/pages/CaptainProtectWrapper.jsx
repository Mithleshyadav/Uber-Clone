import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainProtectWrapper = ({ children }) => {
  const { authenticate , loading} = useContext(CaptainDataContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Checking captain authentication...
      </div>
    );
  }

  // Redirect if not authenticated
  if (!authenticate) {
    return <Navigate to="/captain-login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default CaptainProtectWrapper;
