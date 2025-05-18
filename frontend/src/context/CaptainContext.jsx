import React, {useState,  createContext} from 'react'


export const CaptainDataContext = createContext();

const CaptainContext = ({children}) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = (captain) => {
    setCaptain(captain)
  }
const value = {captain, setCaptain, isLoading, setIsLoading, error, setError, updateCaptain}

  return (
    <div>
      <CaptainDataContext.Provider value={value}>
        {children}
      </CaptainDataContext.Provider>
    </div>
  )
}

export default CaptainContext
