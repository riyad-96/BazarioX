import { useEffect, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { format, formatDistanceToNow, isThisWeek, isThisYear, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import UniModal from '../helpers/UniModal';

function Month() {
  const { allMonthData } = useUniContexts();

  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('This month');
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

    const currentMonthData = allMonthData.filter((eachSession) => eachSession.month == format(new Date(), 'M') && eachSession.year == format(new Date(), 'y'));
    if (currentMonthData) {
      setSelectedMonthData(currentMonthData);
    }
  }, [allMonthData]);

  // refresh times
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => setTick((prev) => prev + 1), 30000);
    return () => clearInterval(timeout);
  }, []);

  // filter selected month data
  function filterMonthBasedData(month, year) {
    const filteredMonthData = allMonthData.filter((eachSession) => eachSession.month == month && eachSession.year == year);
    setSelectedMonthData(filteredMonthData);
  }

  const [sessionDetails, setSessionDetails] = useState(null);

  return (
    <div className="min-h-full py-2">
      <h1 className="text-2xl">Monthly history</h1>

      <div className="my-2 space-y-2">
        {months.length > 1 && (
          <button onClick={() => setMonthSelectionModalOpen(true)} className="flex rounded-md border border-(--slick-border) bg-zinc-100 px-3 py-1 text-sm">
            Select date ({selectedMonth})
          </button>
        )}
        {selectedMonthData.length > 0 && (
          <p>
            Spent on {selectedMonth}: <span className="font-medium">{selectedMonthData.reduce((acc, s) => acc + s.sessionTotal, 0).toFixed(2)} ৳</span>
          </p>
        )}
        {selectedMonthData.length < 1 && (
          <p className="grid h-[40px] place-items-center overflow-hidden rounded-md bg-(--primary) text-center">
            <span>You didn't add anything this month!</span>
          </p>
        )}
      </div>

      <AnimatePresence>
        {monthSelectionModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setMonthSelectionModalOpen(false)} className="fixed inset-0 z-15 grid place-items-center bg-black/30">
            <motion.div initial={{ y: 25, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 25, scale: 0.9 }} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[250px] space-y-2 rounded-xl bg-white p-3">
              <p>Select months:</p>
              <div className="scrollbar-thin grid max-h-[300px] divide-y-1 divide-(--slick-border) overflow-y-auto rounded-lg bg-(--second-lvl-bg)">
                {months.map((m) => {
                  const [month, year] = m.split('-');

                  let monthYear = new Date(year, month - 1).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });

                  let btnText = monthYear;

                  if (month == format(new Date(), 'M') && year == format(new Date(), 'y')) {
                    btnText = 'This month';
                  }

                  return (
                    <button
                      onClick={() => {
                        filterMonthBasedData(month, year);
                        setSelectedMonth(btnText);
                        setMonthSelectionModalOpen(false);
                      }}
                      key={m}
                      className="flex px-3.5 py-1.5"
                    >
                      {btnText}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-2">
        <AnimatePresence>
          {selectedMonthData.map((eachSession, i) => {
            const { id, sessionTitle, sessionAt, bazarList } = eachSession;

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
                key={id}
                className="relative rounded-md bg-(--primary) p-3"
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
                        setSessionDetails(eachSession);
                      }}
                      className="opacity-70"
                    >
                      <span>Click to see details</span>
                      <span className="absolute inset-0"></span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sessionDetails && (
          <UniModal
            onMouseDown={() => setSessionDetails(null)}
            jsx={
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                className="rounded-md bg-(--primary) p-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg">{sessionDetails.sessionTitle?.trim?.() || 'Untitled'}</h2>
                  <span>
                    {(() => {
                      const d = sessionDetails.sessionAt;
                      const timeStr = format(d, 'h:mm a');

                      if (isToday(d)) return timeStr;
                      if (isThisWeek(d)) return `${timeStr}, ${format(d, 'EEE')}`;
                      if (isThisYear(d)) return `${timeStr}, ${format(d, 'MMM d')}`;
                      return `${timeStr}, ${format(d, 'MMM d yyyy')}`;
                    })()}
                  </span>
                </div>
                <p>
                  Session total: <span className="font-medium">{sessionDetails.bazarList.reduce((acc, eachItem) => acc + eachItem.total, 0)} ৳</span>
                </p>
                <div className="mt-2 rounded-md bg-(--second-lvl-bg) p-2">
                  {sessionDetails.bazarList.map((eachItem, i) => {
                    const { id, itemName, price, quantity, unit, total, addedAt } = eachItem;
                    return (
                      <div key={id} className="flex justify-between rounded-md px-2 py-1 text-sm nth-[odd]:bg-zinc-100">
                        <span className="grid flex-3">
                          <span>
                            {i + 1}. {itemName || '...'} {`(${price} ৳)`}
                          </span>
                          <span className="text-xs opacity-80">{format(addedAt, 'h:mm a')}</span>
                        </span>
                        <span className="grid flex-2 place-items-center text-sm">
                          <span>
                            {quantity} {unit}
                          </span>
                        </span>
                        <span className="grid flex-2 place-items-center text-sm">
                          <span>{total} ৳</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Month;
