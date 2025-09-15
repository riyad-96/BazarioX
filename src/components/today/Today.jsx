import React, { useEffect, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow, isThisWeek, isThisYear, isToday } from 'date-fns';
import UniModal from '../helpers/UniModal';

function Today() {
  const { allMonthData, allMonthDataLoading } = useUniContexts();
  const [todaysSessions, setTodaysSessions] = useState([]);

  useEffect(() => {
    setTodaysSessions(() => allMonthData.filter((eachSession) => isToday(eachSession.sessionAt)));
  }, [allMonthData]);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => setTick((prev) => prev + 1), 30000);
    return () => clearInterval(timeout);
  }, []);

  // session details and modal
  const [sessionDetails, setSessionDetails] = useState(null);

  return (
    <div className="min-h-full space-y-2 py-2">
      <h1 className="text-2xl">Today's sessions</h1>

      {todaysSessions.length < 1 && (
        <p className="grid h-[40px] place-items-center overflow-hidden rounded-md bg-(--primary) text-center">
          <span>Your daily bazar sessions will appear here.</span>
        </p>
      )}

      {todaysSessions.length > 0 && (
        <div className="space-y-2">
          <p>
            Today's total expenses: <span className="font-medium">{todaysSessions.reduce((acc, eachSession) => acc + eachSession.sessionTotal, 0).toFixed(2)}</span> ৳
          </p>
          <div className="grid gap-2">
            <AnimatePresence>
              {todaysSessions.map((eachSession, i) => {
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
        </div>
      )}

      <AnimatePresence>
        {sessionDetails && (
          <UniModal
            onMouseDown={() => setSessionDetails(null)}
            className="absolute grid place-items-center"
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
                      <div key={id} className="flex justify-between rounded-md px-2 py-1 text-sm nth-[odd]:bg-zinc-100 dark:nth-[odd]:bg-zinc-900">
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

export default Today;
