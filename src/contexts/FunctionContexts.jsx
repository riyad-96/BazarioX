import { useState, useEffect, createContext, useContext } from 'react';
import { useUniContexts } from './UniContexts';
import { format, isToday } from 'date-fns';

const functionContext = createContext();
export const useFunctionContext = () => useContext(functionContext);

function FunctionContexts({ children }) {
  const { totalSessions, setTotalSessions } = useUniContexts();

  // Cloud sync function
  async function cloudSync() {
    // get data from localStorage.
    // check if any session is _cloudSavePending: true
    // if true then save the data to belonging user's database.
    // run each time application first load.
  }

  // Local sync function
  function handleDataStoring(newSession) {
    const { month, year } = newSession;
    const sessionAPI = JSON.parse(localStorage.getItem('sessionAPI'));

    if (sessionAPI) {
      localStorage.sessionAPI = JSON.stringify({ ...sessionAPI, sessions: [newSession, ...sessionAPI.sessions] });
    } else {
      localStorage.sessionAPI = JSON.stringify({ sessionHistoryDate: `${month}-${year}`, sessions: [newSession] });
    }
  }

  // Retrieve data...
  useEffect(() => {
    const sessionAPI = JSON.parse(localStorage.getItem('sessionAPI'));
    if (sessionAPI) {
      const todaysSessions = sessionAPI.sessions.filter((eachSession) => isToday(eachSession.sessionAt));
      setTotalSessions(todaysSessions);
    }
  }, []);

  return <functionContext.Provider value={{ handleDataStoring }}>{children}</functionContext.Provider>;
}

export default FunctionContexts;
