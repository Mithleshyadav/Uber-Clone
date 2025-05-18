import React from 'react'
import { Link } from 'react-router-dom'
const Start  = () => {
  return (
    <div >
     <div className=' bg-cover bg-center bg-[url(https://www.miniphysics.com/wp-content/uploads/2011/05/file-AYQMIHQeCrps7zXtPZbUT8Iv.webp)] flex pt-8 justify-between flex-col h-screen w-full  bg-red-400'>
      <img className='w-16 ml-8' src="https://www.edigitalagency.com.au/wp-content/uploads/Uber-logo-white-png-900x313.png" alt="" />
      
      <div className='bg-white pb-7 py-4 px-4'>
        <h2 className='text-2xl font-bold'>Get Started with Uber</h2>
        <Link to='/login' className='flex items-center justify-center text-center w-full bg-black text-white py-3 mt-4 rounded'>Continue</Link>
      </div>

     </div>
    </div>
  )
}

export default Start
