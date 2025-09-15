import { useEffect, createContext, useContext, useRef } from 'react';
import { useUniContexts } from './UniContexts';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../configs/firebase';
import toast from 'react-hot-toast';

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

  //! Handle new session storing functionality
  async function handleStoringNewSession(newSession) {
    saveToLocalStorage(newSession);
    const localSessions = JSON.parse(localStorage.getItem('localSessions'));
    setAllMonthData(localSessions);
    toast.success('Session saved locally', {
      duration: 3500,
    });

    if (user && navigator.onLine) {
      const savingPromise = checkForUnsyncedSessionsAndSyncWithCloud();
      toast.promise(
        savingPromise,
        {
          loading: 'Syncing with cloud...',
          success: 'Session synced to cloud',
          error: 'Cloud sync failed',
        },
        { duration: 3500 },
      );
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
      setClickDisabled(false);
      setUnsavedSessionModal(false);
      setAllMonthDataLoading(false);
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
      setAllMonthDataLoading(false);
    }
  }

  function askForSavingLocalDataInDatabase() {
    setUnsavedSessionModal(true);
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
        localStorage.localSessions = JSON.stringify(array);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAllMonthDataLoading(false);
    }
  }

  // Initializing app
  useEffect(() => {
    if (!user) {
      const localSessions = JSON.parse(localStorage.getItem('localSessions'));
      if (localSessions) {
        setAllMonthData(localSessions);
      }

      setAllMonthDataLoading(false);
    }

    if (user) {
      const localSessions = JSON.parse(localStorage.getItem('localSessions'));
      const isSynced = localStorage.getItem('synced');
      if (!localSessions) {
        fetchAllMonthDataFromCloud();
        return;
      }
      if (localSessions && localSessions.length > 0 && !isSynced) {
        askForSavingLocalDataInDatabase();
        return;
      }
      if (localSessions && isSynced) {
        checkForUnsyncedSessionsAndSyncWithCloud();
      }
    }
  }, [user]);

  // auto update data according to database
  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem('synced')) {
      const q = query(collection(db, 'users', user.uid, 'bazarSessions'), orderBy('sessionAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const array = [];
        snapshot.forEach((doc) => array.push(doc.data()));
        setAllMonthData(array);

        localStorage.localSessions = JSON.stringify(array);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // apply theme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) document.documentElement.classList.add('dark');
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  return <functionContext.Provider value={{ handleStoringNewSession, discardLocalAndLoadCloudData, saveToCloudAndLoadCloudData }}>{children}</functionContext.Provider>;
}

export default FunctionContexts;
