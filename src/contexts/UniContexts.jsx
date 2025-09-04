import { createContext, useContext, useState } from 'react';

const uniContexts = createContext();
export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <uniContexts.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </uniContexts.Provider>
  )
}

export default UniContexts;
