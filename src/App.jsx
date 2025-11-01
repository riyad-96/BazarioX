import { Outlet } from 'react-router-dom';
import { useUniContexts } from './contexts/UniContexts';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import { LoadingTopBar, useLoadingTopBar } from './components/helpers/LoadingTopBar';

function App() {
  const { user, clickDisabled, isUserLoading } = useUniContexts();

  const { start, complete } = useLoadingTopBar();

  return (
    <div className="h-dvh bg-(--main-bg)">
      {clickDisabled && <div className="fixed inset-0 z-[100000] cursor-not-allowed"></div>}
      <AnimatePresence>
        {isUserLoading && (
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
        {!isUserLoading && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingTopBar />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
