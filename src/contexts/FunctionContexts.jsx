import { useEffect, createContext, useContext, useRef } from 'react';
import { useUniContexts } from './UniContexts';
import { isToday } from 'date-fns';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../configs/firebase';

const functionContext = createContext();
export const useFunctionContext = () => useContext(functionContext);

function FunctionContexts({ children }) {
  const { user, setTodaysSessions, allMonthData, setAllMonthData, allMonthDataLoading, setAllMonthDataLoading } = useUniContexts();

  // Cloud sync function
  async function cloudSync() {
    if (!user) return;

    const localSessions = JSON.parse(localStorage.getItem('localSessions'));
    if (!localSessions) return;
    const pendingSessions = localSessions.filter((s) => s._cloudSavePending);
    if (pendingSessions.length === 0) return;

    try {
      const cloudSavePromises = pendingSessions.map((s) => {
        const collectionRef = collection(db, 'users', user.uid, 'bazarSessions');
        return addDoc(collectionRef, { ...s, _cloudSavePending: false });
      });
      await Promise.all(cloudSavePromises);
      console.log('cloud save done');

      const updatedSessions = localSessions.map((s) => ({ ...s, _cloudSavePending: false }));
      localStorage.localSessions = JSON.stringify(updatedSessions);
    } catch (err) {
      console.error(err);
    }
  }

  // Local sync function
  function handleDataStoring(newSession) {
    const localSessions = JSON.parse(localStorage.getItem('localSessions'));

    if (localSessions) {
      localStorage.localSessions = JSON.stringify([newSession, ...localSessions]);
    } else {
      localStorage.localSessions = JSON.stringify([newSession]);
    }

    cloudSync();
  }

  // Retrieve all data
  const effectFirstRun = useRef(true);

  useEffect(() => {
    if (effectFirstRun.current) {
      effectFirstRun.current = false;
      console.log('first load');
      return;
    }
    console.log('second load');
    if (user) {
      cloudSync();

      (async () => {
        try {
          const array = [];
          const queries = query(collection(db, 'users', user.uid, 'bazarSessions'), orderBy('sessionAt', 'desc'));
          const snapshots = await getDocs(queries);
          snapshots.forEach((snap) => {
            array.push(snap.data());
          });
          setAllMonthData(array);
        } catch (err) {
          console.error(err);
        } finally {
          setAllMonthDataLoading(false);
        }
      })();
    } else {
      const localSessions = JSON.parse(localStorage.getItem('localSessions'));
      if (localSessions) setAllMonthData(localSessions);
      setAllMonthDataLoading(false);
    }
  }, [user]);

  return <functionContext.Provider value={{ handleDataStoring }}>{children}</functionContext.Provider>;
}

export default FunctionContexts;
