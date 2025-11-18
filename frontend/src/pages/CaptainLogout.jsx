import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
      withCredentials: true,
    })
    .then((response) => {
      if (response.status === 2000) {
        navigate("/captain-login");
      }
    });

  return <div>CaptainLogout</div>;
};

export default CaptainLogout;
