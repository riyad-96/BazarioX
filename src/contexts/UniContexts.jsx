import { createContext, useContext, useState } from 'react';

const uniContexts = createContext();
export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  // user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // calculator page
  const [items, setItems] = useState([]);
  const [isCalcExpanded, setIsCalcExpanded] = useState(true);
  const [session, setSession] = useState({
    id: '',
    sessionTitle: '',
    sessionAt: '',
    sessionTotal: 0,
    bazarList: [],
  });

  // today's sessions
  const [totalSessions, setTotalSessions] = useState([]);

  return (
    <uniContexts.Provider value={{ isLoggedIn, setIsLoggedIn, items, setItems, totalSessions, setTotalSessions, isCalcExpanded, setIsCalcExpanded, session, setSession }}>
      {children}
    </uniContexts.Provider>
  )
}

export default UniContexts;
