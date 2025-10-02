import { motion } from 'motion/react';
import { useUniContexts } from '../../contexts/UniContexts';

function SessionDeleteModal({ state, func }) {
  const { allMonthData } = useUniContexts();
  const { markedSessionsIds, setSessionDeleting, sessionsDeletingLoading } = state;
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
        <div className="space-y-1">
          <h4>
            Selected sessions (<span className="inline-block px-0.5">{markedSessionsIds.length}</span>):
          </h4>
          <div className="flex flex-wrap gap-1">
            {markedSessionsIds.map((id) => {
              const session = allMonthData.find((eachSession) => eachSession.id == id);
              if (!session) return '';
              return (
                <span key={id} className="rounded-full border border-(--slick-border) bg-white px-3 py-0.5 text-sm shadow-xs">
                  {session.sessionTitle.trim() || 'Untitled'}
                </span>
              );
            })}
          </div>
          <p className="mt-4 w-fit rounded-md bg-yellow-100 px-3 py-1 text-sm font-light">
            Your <span className="px-0.5">{markedSessionsIds.length}</span> selected bazar session{markedSessionsIds.length > 1 && 's'} will be lost forever.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button onClick={() => setSessionDeleting(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>
          <button
            onClick={() => {
              if (sessionsDeletingLoading) return;
              deleteSelectedSessions();
            }}
            className={`flex justify-center gap-1.5 rounded-full border-2 border-red-500 bg-(--primary) py-3 text-sm text-red-500 shadow hover:bg-(--primary)/70 ${sessionsDeletingLoading && '!cursor-not-allowed opacity-70'}`}
          >
            <span>Delete</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SessionDeleteModal;
