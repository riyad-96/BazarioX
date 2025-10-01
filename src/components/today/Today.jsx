import { useEffect, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { motion, AnimatePresence } from 'motion/react';
import { isToday } from 'date-fns';
import SessionDetails from '../helpers/SessionDetails';
import EachSession from '../helpers/EachSession';
import { Trash2, X } from 'lucide-react';

function Today() {
  const { allMonthData } = useUniContexts();
  const [todaysSessions, setTodaysSessions] = useState([]);

  useEffect(() => {
    setTodaysSessions(() => allMonthData.filter((eachSession) => isToday(eachSession.sessionAt)));
  }, [allMonthData]);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => setTick((prev) => prev + 1), 60000);
    return () => clearInterval(timeout);
  }, []);

  // session details and modal
  const [sessionDetails, setSessionDetails] = useState(null);

  // marked sessions
  const [markedSessionsIds, setMarkedSessionsIds] = useState([]);

  function filterMarkedSessions(id) {
    setMarkedSessionsIds((prev) => (prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]));
  }

  return (
    <div className="min-h-full space-y-2 py-2">
      <h1 className="text-xl">Today's sessions</h1>

      {todaysSessions.length < 1 && (
        <p className="grid h-[40px] place-items-center overflow-hidden rounded-md bg-(--primary) text-center shadow">
          <span className="font-light opacity-70 max-sm:text-sm">Your daily bazar sessions will appear here.</span>
        </p>
      )}

      {todaysSessions.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span>
              Spent today: <span className="font-medium">{todaysSessions.reduce((acc, eachSession) => acc + eachSession.sessionTotal, 0).toFixed(2)}</span> ৳
            </span>

            <AnimatePresence>
              {markedSessionsIds.length > 0 && (
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
                  className="flex gap-2"
                >
                  <button className="flex items-center gap-1 rounded-md bg-red-200 px-2 py-0.5 text-sm shadow-xs">
                    <span>
                      <Trash2 size="14" />
                    </span>
                    <span>Delete</span>
                  </button>

                  <button onClick={() => setMarkedSessionsIds([])} className="rounded-md bg-(--primary) px-2 py-0.5 text-sm shadow-xs">
                    <X size="20" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`grid gap-2 transition-[gap] duration-150 ${markedSessionsIds.length > 0 && 'gap-2'}`}>
            <AnimatePresence>
              {todaysSessions.map((eachSession, i) => {
                const { id } = eachSession;

                return <EachSession key={`session${id}`} eachSession={eachSession} i={i} state={{ tick, setSessionDetails, markedSessionsIds, setMarkedSessionsIds }} func={{ filterMarkedSessions }} />;
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AnimatePresence>{sessionDetails && <SessionDetails state={{ sessionDetails, setSessionDetails }} />}</AnimatePresence>
    </div>
  );
}

export default Today;
