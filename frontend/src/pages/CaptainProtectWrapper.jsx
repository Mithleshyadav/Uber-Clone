import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const captainProtectWrapper = ({children}) => {

  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const { isLoading, setIsLoading } = useState(true);

  useEffect(() => {
    if(!token) {
      navigate('/captain-login')
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
      headers: {
        Authorization: 
        `Bearer ${token}`
      }
    }).then((Response) => {
      if(Response.status === 2000){
        setCaptain(Response.data.captain)
        console.log("captain:",Response.data.captain)
        console.log("captain details:", captain)
        setIsLoading(false)
      }
    })
    .catch(err => {
      localStorage.removeItem('token')
      navigate('/captain-login')
    })
  }, [ token ])

  if(isLoading){
    return (
      <div>Loading...</div>
    )
  }
  return (
    <>
     {children} 
    </>
  )
}

export default captainProtectWrapper
