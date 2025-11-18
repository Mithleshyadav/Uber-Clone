import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [authenticate, setAuthenticate] = useState(false);
  const [loading, setLoading] = useState(true);

  const resetCredentials = () => {
    setAuthenticate(false);
    setCaptain(null);
  };

  const checkAuthCaptain = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/profile`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setCaptain(response.data?.captain);

        setAuthenticate(true);
      } else {
        resetCredentials();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Session expired. Please log in again."
      );
      resetCredentials();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "captain") {
      checkAuthCaptain();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <CaptainDataContext.Provider
      value={{
        captain,
        setCaptain,
        authenticate,
        setAuthenticate,
        loading,
        resetCredentials,
      }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
