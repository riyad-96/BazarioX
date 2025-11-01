import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { adminEmail, auth, db } from '../configs/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const uniContexts = createContext();

export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  // user
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  //app
  const [isPointerCoarse, _] = useState(() => {
    return window.matchMedia('(pointer: coarse)').matches;
  });
  const [clickDisabled, setClickDisabled] = useState(false);
  const [progress, setProgress] = useState(0);

  // user watcher function
  async function registerNewUserInfos(user) {
    if (!user) return;
    if (user.providerData[0].providerId !== 'google.com') return;

    const userInfo = await getDoc(doc(db, 'users', user.uid));
    if (userInfo.exists()) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'pictures'), {
        isSelected: true,
        addedAt: serverTimestamp(),
        url: user.photoURL,
      });
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        username: user.displayName || '',
        phone: '',
        joinDate: serverTimestamp(),
        admin: false,
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await registerNewUserInfos(user);

      setUser(user);
      setClickDisabled(false);
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // user data
  const [userDataLoading, setUserDataLoading] = useState(true);

  const [userData, setUserData] = useState({
    username: '',
    phone: '',
    pictures: [],
    feedback: {
      comment: '',
      rating: 0,
    },
    featureRequests: [],
    reports: [],
  });

  // admin
  function isAdmin() {
    return user && user?.email === adminEmail;
  }
  const [allUsers, setAllUsers] = useState([]);

  // Home page
  const [unsavedSessionModal, setUnsavedSessionModal] = useState(false);

  // calculator page
  const [currentSession, setCurrentSession] = useState(() => {
    const savedCurrentSession = JSON.parse(localStorage.getItem('currentSession'));
    if (savedCurrentSession) {
      return savedCurrentSession;
    } else {
      return { sessionTitle: '', bazarList: [] };
    }
  });

  useEffect(() => {
    localStorage.currentSession = JSON.stringify(currentSession);
  }, [currentSession]);

  const [isCalcExpanded, setIsCalcExpanded] = useState(true);

  // monthly history
  const [allMonthData, setAllMonthData] = useState([]);
  const [allMonthDataLoading, setAllMonthDataLoading] = useState(true);

  return <uniContexts.Provider value={{ user, setUser, clickDisabled, setClickDisabled, isUserLoading, setIsUserLoading, isAdmin, allUsers, setAllUsers, isPointerCoarse, userData, setUserData, userDataLoading, setUserDataLoading, unsavedSessionModal, setUnsavedSessionModal, currentSession, setCurrentSession, isCalcExpanded, setIsCalcExpanded, allMonthData, setAllMonthData, allMonthDataLoading, setAllMonthDataLoading, progress, setProgress }}>{children}</uniContexts.Provider>;
}

export default UniContexts;
