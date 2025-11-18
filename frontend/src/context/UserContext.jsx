import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticate, setAuthenticate] = useState(false);
  const [loading, setLoading] = useState(true);

  const resetCredentials = () => {
    setUser(null);
    setAuthenticate(false);
  };

  const checkAuthUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/checkAuth`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setUser(response.data?.user);
        setAuthenticate(true);
      } else {
        resetCredentials();
      }
    } catch (err) {
      const errorData = err?.response?.data;
      toast.error(
        errorData?.message ||
          "Session expired or invalid credentials. Please log in again."
      );
      resetCredentials();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "user") {
      checkAuthUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserDataContext.Provider
      value={{ user, setUser, authenticate, setAuthenticate, loading }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
