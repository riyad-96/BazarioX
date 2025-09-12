import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../configs/firebase';

const uniContexts = createContext();
export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  // user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // calculator page
  const [bazarList, setBazarList] = useState([]);
  const [isCalcExpanded, setIsCalcExpanded] = useState(true);
  const [totalSessions, setTotalSessions] = useState([]);

  // user watcher function
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <uniContexts.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, bazarList, setBazarList, totalSessions, setTotalSessions, isCalcExpanded, setIsCalcExpanded }}>{children}</uniContexts.Provider>;
}

export default UniContexts;
