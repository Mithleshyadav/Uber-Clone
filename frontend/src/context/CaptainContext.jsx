import React, {useState,useEffect, createContext} from 'react'


export const CaptainDataContext = createContext();

const CaptainContext = ({children}) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedCaptain = localStorage.getItem("captain");
    if (storedCaptain) {
      setCaptain(JSON.parse(storedCaptain));
    }
    setIsLoading(false);
  }, []);

 
const value = {captain, setCaptain, isLoading, setIsLoading, error, setError}

  return (
    <div>
      <CaptainDataContext.Provider value={value}>
        {children}
      </CaptainDataContext.Provider>
    </div>
  )
}

export default CaptainContext
