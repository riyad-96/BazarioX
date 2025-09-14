import { useEffect, createContext, useContext, useRef } from 'react';
import { useUniContexts } from './UniContexts';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../configs/firebase';

const functionContext = createContext();
export const useFunctionContext = () => useContext(functionContext);

function FunctionContexts({ children }) {
  const { user, setAllMonthData, setAllMonthDataLoading, setUnsavedSessionModal, setClickDisabled } = useUniContexts();

  // ! -------------- New functions --------------
  // save to local function
  function saveToLocalStorage(newSession) {
    const localSessions = JSON.parse(localStorage.getItem('localSessions'));

    if (localSessions) {
      localStorage.localSessions = JSON.stringify([newSession, ...localSessions]);
    } else {
      localStorage.localSessions = JSON.stringify([newSession]);
    }
  }

  // save to database function
  async function saveToDatabase() {
    checkForUnsyncedSessionsAndSyncWithCloud();
  }

  //! Handle new session storing functionality
  function handleStoringNewSession(newSession) {
    saveToLocalStorage(newSession);
    const localSessions = JSON.parse(localStorage.getItem('localSessions'));
    setAllMonthData(localSessions);

    if (user && navigator.onLine) {
      saveToDatabase();
    }
  }

  // Ask user to save local unsaved session in cloud
  async function discardLocalAndLoadCloudData() {
    setAllMonthDataLoading(true);
    try {
      const array = [];
      const queries = query(collection(db, 'users', user.uid, 'bazarSessions'), orderBy('sessionAt', 'desc'));
      const snapshots = await getDocs(queries);
      snapshots.forEach((snap) => {
        array.push(snap.data());
      });
      setAllMonthData(array);
      localStorage.clear();
      localStorage.localSessions = JSON.stringify(array);
      localStorage.synced = 'true';
    } catch (err) {
      console.error(err);
    } finally {
      setAllMonthDataLoading(false);
      setClickDisabled(false);
      setUnsavedSessionModal(false);
    }
  }

  async function saveToCloudAndLoadCloudData() {
    try {
      const unsavedLocalSessions = JSON.parse(localStorage.getItem('localSessions'));
      if (unsavedLocalSessions && unsavedLocalSessions.length > 0) {
        const bazarSessionCollection = collection(db, 'users', user.uid, 'bazarSessions');
        const cloudPromises = unsavedLocalSessions.map((s) => {
          return addDoc(bazarSessionCollection, { ...s, _synced: true });
        });
        await Promise.all(cloudPromises);

        const allSavedSession = await getDocs(query(bazarSessionCollection, orderBy('sessionAt', 'desc')));
        const array = [];
        allSavedSession.forEach((doc) => {
          array.push(doc.data());
        });
        setAllMonthData(array);
        localStorage.localSessions = JSON.stringify(array);
        localStorage.synced = 'true';
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClickDisabled(false);
      setUnsavedSessionModal(false);
    }
  }

  function askForSavingLocalDataInDatabase() {
    setUnsavedSessionModal(true);
  }

  async function checkForUnsyncedSessionsAndSyncWithCloud() {
    const localSessions = JSON.parse(localStorage.getItem('localSessions'));
    try {
      const unsyncedSessions = localSessions.filter((s) => !s._synced);
      if (unsyncedSessions && unsyncedSessions.length > 0) {
        const bazarSessionCollection = collection(db, 'users', user.uid, 'bazarSessions');
        const cloudPromises = unsyncedSessions.map((s) => {
          return addDoc(bazarSessionCollection, { ...s, _synced: true });
        });
        await Promise.all(cloudPromises);

        const allSavedSession = await getDocs(query(bazarSessionCollection, orderBy('sessionAt', 'desc')));
        const array = [];
        allSavedSession.forEach((doc) => {
          array.push(doc.data());
        });
        setAllMonthData(array);
        localStorage.localSessions = JSON.stringify(array);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch all the data from cloud
  async function fetchAllMonthDataFromCloud() {
    try {
      const array = [];
      const queries = query(collection(db, 'users', user.uid, 'bazarSessions'), orderBy('sessionAt', 'desc'));
      const snapshots = await getDocs(queries);
      snapshots.forEach((snap) => {
        array.push(snap.data());
      });
      setAllMonthData(array);
      localStorage.localSessions = JSON.stringify(array);
      localStorage.synced = 'true';
    } catch (err) {
      console.error(err);
    } finally {
      setAllMonthDataLoading(false);
    }
  }

  // Initializing app
  const firstLoad = useRef(true);

  useEffect(() => {
    // console.log(user);
    // if (firstLoad.current) {
    //   firstLoad.current = false;
    //   return;
    // }

    if (user) {
      const localSessions = JSON.parse(localStorage.getItem('localSessions'));
      const isSynced = localStorage.getItem('synced');
      if (!localSessions) {
        fetchAllMonthDataFromCloud();
        return;
      }
      if (localSessions && !isSynced) {
        askForSavingLocalDataInDatabase();
        return;
      }
      if (localSessions && isSynced) {
        setAllMonthData(localSessions);
        checkForUnsyncedSessionsAndSyncWithCloud();
      }
    } else {
      const localSessions = JSON.parse(localStorage.getItem('localSessions'));
      if (localSessions) {
        setAllMonthData(localSessions);
      }
    }
  }, [user]);

  return <functionContext.Provider value={{ handleStoringNewSession, discardLocalAndLoadCloudData, saveToCloudAndLoadCloudData }}>{children}</functionContext.Provider>;
}

export default FunctionContexts;
