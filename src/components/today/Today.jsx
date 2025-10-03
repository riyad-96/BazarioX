import { useEffect, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { motion, AnimatePresence } from 'motion/react';
import { isToday } from 'date-fns';
import SessionDetails from '../helpers/SessionDetails';
import EachSession from '../helpers/EachSession';
import { ArrowUpDown, CheckCheck, Trash2, X } from 'lucide-react';
import SessionDeleteModal from '../helpers/SessionDeleteModal';
import { requestSessionDelete } from '../helpers/functions';
import toast from 'react-hot-toast';

function Today() {
  const { user, allMonthData, setAllMonthData } = useUniContexts();
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

  // delete sessions
  const [sessionsDeleting, setSessionDeleting] = useState(false);
  const [sessionsDeletingLoading, setSessionsDeletingLoading] = useState(false);

  function deleteSelectedSessions() {
    setSessionsDeletingLoading(true);

    const deleteDocsPromise = requestSessionDelete(user, markedSessionsIds);

    toast.promise(deleteDocsPromise, {
      loading: 'Deleting sessions...',
      success: () => {
        setSessionDeleting(false);
        setSessionsDeletingLoading(false);
        setAllMonthData((prev) => prev.filter((session) => !markedSessionsIds.includes(session.id)));
        setMarkedSessionsIds([]);
        return `${markedSessionsIds.length} session${markedSessionsIds.length > 1 ? 's' : ''} deleted`;
      },
      error: (err) => {
        setSessionsDeletingLoading(false);
        return err;
      },
    });
  }

  // list ordering
  const [order, setOrder] = useState('desc');

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
          <div className="grid">
            <div className="flex items-center justify-between">
              <span>
                Spent today: <span className="font-medium">{todaysSessions.reduce((acc, eachSession) => acc + eachSession.sessionTotal, 0).toFixed(2)}</span> ৳
              </span>

              {todaysSessions.length > 1 && (
                <button
                  onClick={() => {
                    if (order === 'desc') {
                      setOrder('asc');
                    } else {
                      setOrder('desc');
                    }
                    setTodaysSessions((prev) => prev.reverse());
                  }}
                  className="flex items-center gap-2 rounded-md bg-(--primary) py-0.5 pr-2 pl-2.5 text-sm shadow-xs"
                >
                  <span>{order === 'desc' ? 'New first' : 'Old first'}</span>
                  <ArrowUpDown size="14" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {markedSessionsIds.length > 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    marginBlock: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    marginBlock: '0.425rem',
                    height: 24,
                  }}
                  exit={{
                    opacity: 0,
                    marginBlock: 0,
                    height: 0,
                  }}
                  className="flex justify-end gap-2 overflow-hidden"
                >
                  <button onClick={() => setSessionDeleting(true)} className="flex items-center gap-1 rounded-md bg-red-200 px-2 py-0.5 text-sm shadow-xs">
                    <span>
                      <Trash2 size="14" />
                    </span>
                    <span>
                      Delete (<span className="px-0.5">{markedSessionsIds.length}</span>)
                    </span>
                  </button>

                  <button onClick={() => setMarkedSessionsIds([])} className="flex rounded-md bg-(--primary) px-2 py-0.5 text-sm shadow-xs">
                    <X size="20" />
                  </button>

                  <button onClick={() => setMarkedSessionsIds(todaysSessions.map((eachSession) => eachSession.id))} className="flex rounded-md bg-(--primary) px-2 py-0.5 text-sm shadow-xs">
                    <CheckCheck size="20" />
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

      <AnimatePresence>{sessionsDeleting && <SessionDeleteModal state={{ markedSessionsIds, setSessionDeleting, sessionsDeletingLoading }} func={{ deleteSelectedSessions }} />}</AnimatePresence>

      <AnimatePresence>{sessionDetails && <SessionDetails state={{ sessionDetails, setSessionDetails }} />}</AnimatePresence>
    </div>
  );
}

export default Today;
