import { motion } from 'motion/react';

function UniModal({ onMouseDown, jsx }) {
  return (
    <motion.div
      initial={{
        backgroundColor: 'hsl(0, 0%, 100%, 0)',
      }}
      animate={{
        backgroundColor: 'hsl(0, 0%, 100%, 0.8)',
      }}
      exit={{
        backgroundColor: 'hsl(0, 0%, 100%, 0)',
      }}
      onMouseDown={onMouseDown}
      className="fixed inset-0 z-20 grid place-items-center overflow-y-auto px-4 py-10"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 20,
        }}
        className="w-full max-w-[500px] rounded-md border border-(--slick-border) bg-(--primary)"
      >
        {jsx}
      </motion.div>
    </motion.div>
  );
}

export default UniModal;
