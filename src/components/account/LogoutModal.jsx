import { signOut } from 'firebase/auth';
import { motion } from 'motion/react';
import { auth } from '../../configs/firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUniContexts } from '../../contexts/UniContexts';
import { useEffect, useRef, useState } from 'react';

function LogoutModal({ state }) {
  const { setRequestingLogout } = state;
  const { setAllMonthData, setCurrentSession } = useUniContexts();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setRequestingLogout(false)} className="fixed inset-0 z-20 grid place-items-center justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px', opacity: 0 }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[450px] space-y-4 rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        <div className="space-y-2">
          <h3 className="text-2xl">Logout !</h3>
          <span>Do you want to logout from this account?</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setRequestingLogout(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                await signOut(auth);
                toast.success('Logged out successfully!', { duration: 2500 });
                setAllMonthData([]);
                setCurrentSession({ sessionTitle: '', bazarList: [] });
                localStorage.clear();
                // navigate(-2);
              } catch (err) {
                toast.error('Logout failed, please try again.', { duration: 2500 });
                console.error(err);
              }
            }}
            className={`flex justify-center gap-1.5 rounded-full border-2 border-red-500 bg-(--primary) py-3 text-sm text-red-500 shadow hover:bg-(--primary)/70`}
          >
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LogoutModal;
