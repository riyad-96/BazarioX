import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../configs/firebase';

const uniContexts = createContext();
export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  // user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);

  //app
  const [clickDisabled, setClickDisabled] = useState(false);

  // Home page
  const [unsavedSessionModal, setUnsavedSessionModal] = useState(false);

  // calculator page
  const [bazarList, setBazarList] = useState([]);
  const [isCalcExpanded, setIsCalcExpanded] = useState(true);

  // user watcher function
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setIsUserDataLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // monthly history
  const [allMonthData, setAllMonthData] = useState([]);
  const [allMonthDataLoading, setAllMonthDataLoading] = useState(true);

  useEffect(() => {
    console.log('all data', allMonthData);
  }, [allMonthData]);

  return <uniContexts.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, clickDisabled, setClickDisabled, isUserDataLoading, setIsUserDataLoading, unsavedSessionModal, setUnsavedSessionModal, bazarList, setBazarList, isCalcExpanded, setIsCalcExpanded, allMonthData, setAllMonthData, allMonthDataLoading, setAllMonthDataLoading }}>{children}</uniContexts.Provider>;
}

export default UniContexts;
