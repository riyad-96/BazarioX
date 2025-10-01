import { motion } from 'motion/react';
import { format, formatDistanceToNow, isThisWeek, isThisYear, isToday } from 'date-fns';
import { useUniContexts } from '../../contexts/UniContexts';
import { Check } from 'lucide-react';

function EachSession({ eachSession, i, state, func }) {
  const { tick, setSessionDetails, markedSessionsIds, setMarkedSessionsIds } = state;
  const { filterMarkedSessions } = func;
  const { isPointerCoarse } = useUniContexts();
  const { id, sessionTitle, sessionAt, bazarList } = eachSession;

  const isSelected = markedSessionsIds.includes(id);

  return (
    <motion.div
      initial={{
        opacity: 0.2,
        scale: 0.99,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        opacity: {
          duration: 0.3,
          delay: 0.05 * i,
        },
        scale: {
          duration: 0.2,
          delay: 0.05 * i,
        },
      }}
      className={`group relative rounded-md bg-(--primary) p-3 outline-2 transition-[margin,outline-color] duration-150 ${isSelected ? 'my-0.5 outline-zinc-700' : 'shadow outline-transparent'}`}
    >
      <div className="grid">
        <div className="flex justify-between">
          <span>{sessionTitle || 'Untitled'}</span>
          <span>
            Total: <span className="font-medium">{bazarList.reduce((acc, eachBazar) => acc + eachBazar.total, 0)}</span> ৳
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex gap-2 text-sm opacity-80">
            <span key={tick}>{formatDistanceToNow(sessionAt, new Date())}</span>
            <span>
              {(() => {
                if (isToday(sessionAt)) {
                  return format(sessionAt, 'h:mm a');
                }
                if (isThisWeek(sessionAt)) {
                  return format(sessionAt, 'EEE');
                }
                if (isThisYear(sessionAt)) {
                  return format(sessionAt, 'MMM d');
                }
                return format(sessionAt, 'MMM d, yyyy');
              })()}
            </span>
          </div>

          <button
            onClick={() => {
              if (markedSessionsIds.length > 0) {
                filterMarkedSessions(id);
                return;
              }
              setSessionDetails(eachSession);
            }}
            onContextMenu={(e) => {
              if (isPointerCoarse) {
                e.preventDefault();
                filterMarkedSessions(id);
              }
            }}
            className="opacity-70"
          >
            <span>Click to see details</span>
            <span className="absolute inset-0"></span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();

              if (!isPointerCoarse) {
                filterMarkedSessions(id);
              }
            }}
            className={`absolute top-0 left-0 z-5 grid size-[18px] translate-x-[-40%] translate-y-[-40%] place-items-center rounded-full bg-zinc-800 text-white transition duration-150 ${isSelected ? 'opacity-100' : 'scale-80 opacity-0 pointer-fine:group-hover:scale-100 pointer-fine:group-hover:opacity-100'}`}
          >
            {<Check size="12" strokeWidth="3" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default EachSession;
