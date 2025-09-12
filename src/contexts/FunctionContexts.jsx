import { useEffect, createContext, useContext } from 'react';
import { useUniContexts } from './UniContexts';
import { isToday } from 'date-fns';

const functionContext = createContext();
export const useFunctionContext = () => useContext(functionContext);

function FunctionContexts({ children }) {
  const { user, totalSessions, setTotalSessions } = useUniContexts();

  // Cloud sync function
  async function cloudSync() {
    if (!user) return;
    // get data from localStorage.
    // check if any session is _cloudSavePending: true
    // if true then save the data to belonging user's database.
    // run each time application first loads.
    const sessionAPI = JSON.parse(localStorage.getItem('sessionAPI'));
    if (sessionAPI) {
      // const pendingSessions = sessionAPI.sessions.filter((eachSession) => eachSession._cloudSavePending);
      // const resolvedSessions = sessionAPI.sessions.map((eachSession) => ({ ...eachSession, _cloudSavePending: false }));
      // console.log(pendingSessions);
      // console.log(resolvedSessions);
    }
  }

  // Local sync function
  function handleDataStoring(newSession) {
    const localSessions = JSON.parse(localStorage.getItem('localSessions')) || [];

    if (localSessions) {
      localStorage.localSessions = JSON.stringify([newSession, ...localSessions]);
    } else {
      localStorage.localSessions = JSON.stringify([newSession]);
    }

    cloudSync();
  }

  // Retrieve data...
  useEffect(() => {
    const localSessions = JSON.parse(localStorage.getItem('localSessions'));
    if (localSessions) {
      const todaysSessions = localSessions.filter((s) => isToday(s.sessionAt));
      setTotalSessions(todaysSessions);
      cloudSync();
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return <functionContext.Provider value={{ handleDataStoring }}>{children}</functionContext.Provider>;
}

export default FunctionContexts;
