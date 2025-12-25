import { motion } from 'motion/react';

function AppLoading() {
  return (
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
        <span className="text-2xl font-medium">Bazario</span>
        <span className="loading loading-infinity flex size-[50px]"></span>
      </div>
    </motion.div>
  );
}

export default AppLoading;
