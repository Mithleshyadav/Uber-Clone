import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainProtectWrapper = ({ children }) => {
  const { authenticate, loading } = useContext(CaptainDataContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Checking captain authentication...
      </div>
    );
  }

  if (!authenticate) {
    return <Navigate to="/captain-login" replace />;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
