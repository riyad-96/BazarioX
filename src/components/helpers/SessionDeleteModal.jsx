import { motion } from 'motion/react';

function SessionDeleteModal({ state, func }) {
  const { markedSessionsIds, setSessionDeleting } = state;
  const { deleteSelectedSessions } = func;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSessionDeleting(false)} className="fixed inset-0 z-20 grid place-items-center justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px', opacity: 0 }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[450px] rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        <h3 className="mb-2 text-xl">Delete selected sessions !</h3>
        <p>
          Your (<span className="px-0.5">{markedSessionsIds.length}</span>) bazar sessions will lost forever.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button onClick={() => setSessionDeleting(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>
          <button onClick={deleteSelectedSessions} className={`flex justify-center gap-1.5 rounded-full border-2 border-red-500 bg-(--primary) py-3 text-sm text-red-500 shadow hover:bg-(--primary)/70`}>
            <span>Delete</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SessionDeleteModal;
