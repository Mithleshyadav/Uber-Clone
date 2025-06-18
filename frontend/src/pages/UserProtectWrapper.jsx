import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserDataContext'
const UserProtectWrapper = ({children}) => {

  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  useEffect(()=>{
    
    if (!token){
      navigate('/login')
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
            })
  }, [token])

  if (setIsLoading) {
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

export default UserProtectWrapper
