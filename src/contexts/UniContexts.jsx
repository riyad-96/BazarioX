import { createContext, useContext, useState } from 'react';

const uniContexts = createContext();
export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  // user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // calculator page
  const [bazarList, setBazarList] = useState([]);
  const [isCalcExpanded, setIsCalcExpanded] = useState(true);
  const [totalSessions, setTotalSessions] = useState([]);

  return <uniContexts.Provider value={{ isLoggedIn, setIsLoggedIn, bazarList, setBazarList, totalSessions, setTotalSessions, isCalcExpanded, setIsCalcExpanded }}>{children}</uniContexts.Provider>;
}

export default UniContexts;
