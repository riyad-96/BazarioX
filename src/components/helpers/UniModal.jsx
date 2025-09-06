import { motion } from 'motion/react';

function UniModal({ className, onMouseDown, jsx }) {
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
      className={`${className} inset-0 z-20 px-4 py-10 overflow-y-auto`}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: '20%',
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 0,
        }}
        className="w-full bg-(--primary) max-w-[500px] rounded-md border border-(--slick-border)"
      >
        {jsx}
      </motion.div>
    </motion.div>
  );
}

export default UniModal;
