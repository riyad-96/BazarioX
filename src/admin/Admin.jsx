import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { useUniContexts } from '../contexts/UniContexts';
import toast from 'react-hot-toast';

function Admin() {
  const { allUsers, setAllUsers } = useUniContexts();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        setAllUsers(usersSnap.docs.map((res) => res.data()));
      } catch (err) {
        toast.error('Error loading users');
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    console.log(allUsers);
  }, [allUsers]);

  return (
    <div className="h-dvh bg-(--main-bg) p-2">
      <div className="mx-auto flex size-full max-w-[1200px] gap-3">
        <Sidebar state={{ sidebarOpen, setSidebarOpen }} />

        <div className="grid flex-1 grid-rows-[auto_1fr] gap-3">
          <NavBar state={{ setSidebarOpen }} />
          <div className="overflow-y-auto px-0.5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
