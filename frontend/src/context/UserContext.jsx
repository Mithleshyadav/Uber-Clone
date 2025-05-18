import React, {createContext, useState} from 'react'
import axios from 'axios'



export const UserDataContext = createContext();

const UserContext = ({children}) => {

  const [user, setUser] = useState(null);
  return (
    <div>
      <UserDataContext.Provider value={[user, setUser]}>

     {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
