import { Outlet } from 'react-router-dom';
import { useUniContexts } from './contexts/UniContexts';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';

function App() {
  const { clickDisabled, isUserDataLoading } = useUniContexts();

  return (
    <div className="mx-auto h-dvh max-w-[700px] bg-(--main-bg)">
      <Toaster position="top-center" />

      {clickDisabled && <div className="fixed inset-0 z-[100000] cursor-not-allowed"></div>}
      <AnimatePresence>
        {isUserDataLoading && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-5 grid h-full place-items-center bg-(--primary)"
          >
            <div className="grid justify-items-center">
              <span className="text-2xl font-medium">KitzoBazar</span>
              <span className="loading loading-infinity flex size-[50px]"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isUserDataLoading && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.99,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
