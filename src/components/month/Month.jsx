import { useEffect, useRef, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { format, isThisWeek } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpDown, Calendar, CheckCheck, Trash2, X } from 'lucide-react';
import SessionDetails from '../helpers/SessionDetails';
import EachSession from '../helpers/EachSession';
import SessionDeleteModal from '../helpers/SessionDeleteModal';
import { requestSessionDelete } from '../helpers/functions';
import toast from 'react-hot-toast';

function Month() {
  const { user, allMonthData, setAllMonthData } = useUniContexts();

  const [months, setMonths] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState('This month');
  const [monthInNumber, setMonthInNumber] = useState(`${format(new Date(), 'M')}-${format(new Date(), 'y')}`);
  const [selectedMonthData, setSelectedMonthData] = useState([]);

  const [monthSelectionModalOpen, setMonthSelectionModalOpen] = useState(false);

  // Initial current month data
  useEffect(() => {
    if (allMonthData.length < 1) {
      setSelectedMonthData([]);
      return;
    }

    const allMonths = Array.from(new Set([format(new Date(), 'M-y'), ...allMonthData.map((s) => `${s.month}-${s.year}`)]));
    if (allMonths) {
      setMonths(allMonths);
    }
  }, [allMonthData]);

  // filter selected month data

  function getMonthInText(monthYearInNumber) {
    const [month, year] = monthYearInNumber.split('-');

    let monthYear = new Date(year, month - 1).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    if (month == format(new Date(), 'M') && year == format(new Date(), 'y')) {
      monthYear = 'This month';
    }

    return monthYear;
  }

  useEffect(() => {
    const [month, year] = monthInNumber.split('-');
    const filteredMonthData = allMonthData.filter((eachSession) => eachSession.month == month && eachSession.year == year);
    setSelectedMonthData(filteredMonthData);
    setSelectedMonthYear(getMonthInText(monthInNumber));
  }, [monthInNumber, allMonthData]);

  // stats
  const stat = useRef({
    totalSpent: 0,
    totalItems: 0,
    totalSessions: 0,
    lastSession: '',
  });

  if (selectedMonthData.length > 0) {
    stat.current = {
      totalSpent: selectedMonthData.reduce((acc, s) => acc + s.sessionTotal, 0),
      totalItems: selectedMonthData.reduce((acc, s) => acc + s.bazarList.length, 0),
      totalSessions: selectedMonthData.length,
      lastSession: isThisWeek(selectedMonthData[0].sessionAt) ? format(selectedMonthData[0].sessionAt, 'EEEE') : format(selectedMonthData[0].sessionAt, 'd MMM y'),
    };
  }

  // refresh times
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => setTick((prev) => prev + 1), 60000);
    return () => clearInterval(timeout);
  }, []);

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
        setAllMonthData((prev) => prev.filter((session) => !markedSessionsIds.includes(session.id)));
        setMarkedSessionsIds([]);
        setSessionDeleting(false);
        setSessionsDeletingLoading(false);
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
    <div className="min-h-full py-2">
      <h1 className="text-xl">Monthly history</h1>

      <div className="my-2">
        {months.length > 1 && (
          <button onClick={() => setMonthSelectionModalOpen(true)} className="mb-4 flex items-center gap-2 rounded-md border border-(--slick-border) bg-(--primary) px-3 py-1 text-sm shadow-xs">
            <span>
              <Calendar size="16" />
            </span>
            <span>Select date ({selectedMonthYear})</span>
          </button>
        )}

        {selectedMonthData.length < 1 && (
          <p className="grid h-[40px] place-items-center overflow-hidden rounded-md bg-(--primary) text-center shadow">
            <span className="font-light opacity-70 max-sm:text-sm">You didn't add anything this month!</span>
          </p>
        )}
      </div>

      {selectedMonthData.length > 0 && (
        <div className="mt-4 mb-2 grid grid-cols-[1fr_auto_1fr] gap-4 rounded-lg bg-(--primary) p-3 shadow">
          <div className="divide-y divide-(--slick-border)">
            <div className="grid content-center justify-items-center py-4">
              <span className="text-lg leading-6">{stat.current.totalSpent.toLocaleString()} ৳</span>
              <span className="text-sm leading-4">Spent</span>
            </div>
            <div className="grid content-center justify-items-center py-4">
              <span className="text-lg leading-6">{stat.current.totalItems}</span>
              <span className="text-sm leading-4">Items</span>
            </div>
          </div>

          <div className="w-[1px] bg-(--slick-border)"></div>

          <div className="divide-y divide-(--slick-border)">
            <div className="grid content-center justify-items-center py-4">
              <span className="text-lg leading-6">{stat.current.totalSessions}</span>
              <span className="text-sm leading-4">Sessions</span>
            </div>
            <div className="grid content-center justify-items-center py-4">
              <span className="text-lg leading-6">{stat.current.lastSession}</span>
              <span className="text-sm leading-4">Last session</span>
            </div>
          </div>
        </div>
      )}

      {selectedMonthData.length > 0 && (
        <div className="mt-4 mb-2">
          <div className="grid">
            <div className="flex items-center justify-between">
              <span>
                Spent on {selectedMonthYear}: <span className="font-medium">{selectedMonthData.reduce((acc, s) => acc + s.sessionTotal, 0).toFixed(2)} ৳</span>
              </span>

              {selectedMonthData.length > 1 && (
                <button
                  onClick={() => {
                    if (order === 'desc') {
                      setOrder('asc');
                    } else {
                      setOrder('desc');
                    }
                    setSelectedMonthData((prev) => prev.reverse());
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

                  <button onClick={() => setMarkedSessionsIds(selectedMonthData.map((eachSession) => eachSession.id))} className="flex rounded-md bg-(--primary) px-2 py-0.5 text-sm shadow-xs">
                    <CheckCheck size="20" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <AnimatePresence>
          {selectedMonthData.map((eachSession, i) => {
            const { id } = eachSession;

            return <EachSession key={`session${id}`} eachSession={eachSession} i={i} state={{ tick, setSessionDetails, markedSessionsIds, setMarkedSessionsIds }} func={{ filterMarkedSessions }} />;
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>{sessionDetails && <SessionDetails state={{ sessionDetails, setSessionDetails }} />}</AnimatePresence>

      <AnimatePresence>
        {monthSelectionModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setMonthSelectionModalOpen(false)} className="fixed inset-0 z-15 grid place-items-center bg-black/30">
            <motion.div initial={{ y: 25, scale: 0.9 }} animate={{ y: 0, scalze: 1 }} exit={{ y: 25, scale: 0.9 }} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[300px] space-y-2 rounded-xl bg-white p-3">
              <p>Select months:</p>
              <div className="scrollbar-thin grid max-h-[300px] divide-y-1 divide-(--slick-border) overflow-y-auto rounded-lg bg-(--second-lvl-bg)">
                {months.map((m) => (
                  <button
                    onClick={() => {
                      setMonthInNumber(m);
                      setMarkedSessionsIds([]);
                      setMonthSelectionModalOpen(false);
                    }}
                    key={m}
                    className="flex px-3.5 py-2"
                  >
                    {getMonthInText(m)}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{sessionsDeleting && <SessionDeleteModal state={{ markedSessionsIds, setSessionDeleting, sessionsDeletingLoading }} func={{ deleteSelectedSessions }} />}</AnimatePresence>
    </div>
  );
}

export default Month;
