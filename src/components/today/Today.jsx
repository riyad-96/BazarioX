import React, { useEffect, useRef, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow, isThisWeek, isThisYear, isToday } from 'date-fns';

function Today() {
  const { totalSessions, setTotalSessions } = useUniContexts();

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setTick((prev) => prev + 1), 10000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-full space-y-2 py-2">
      <h1 className="text-2xl">Today's sessions</h1>
      <AnimatePresence>
        {totalSessions.length < 1 && (
          <motion.p
            initial={{
              height: 0,
            }}
            animate={{
              height: '50px',
            }}
            exit={{
              height: 0,
            }}
            className="grid place-items-center overflow-hidden rounded-md bg-(--primary) text-center"
          >
            <span>You didn't buy anything today</span>
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {totalSessions.length > 0 && (
          <div className="space-y-2">
            <p className="text-lg">
              Today's total expenses: <span className="font-medium underline underline-offset-2">{totalSessions.reduce((acc, eachSession) => acc + eachSession.sessionTotal, 0)}</span> ৳
            </p>
            <div className="grid gap-2">
              {totalSessions.map((eachSession) => {
                const { id, sessionTitle, sessionAt, bazarList } = eachSession;

                return (
                  <div key={id} className="rounded-md bg-(--primary) p-3">
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
                        <button className="underline underline-offset-2 opacity-80">See details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Today;
