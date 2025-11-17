import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const UserProtectWrapper = ({ children }) => {
  const { authenticate, loading } = useContext(UserDataContext);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Checking authentication...
      </div>
    );
  }

  if (!authenticate) {
    // ✅ Correct usage of Navigate (component)
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
