import { motion } from 'motion/react';
import { useUniContexts } from '../../contexts/UniContexts';
import { format } from 'date-fns';
import { BadgeCheck, Ban, ClockFading, Hammer, ScanEye } from 'lucide-react';
import { useRef, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import toast from 'react-hot-toast';

function ReportField() {
  const { user, userData, setUserData } = useUniContexts();

  const [report, setReport] = useState({
    title: '',
    details: '',
  });
  const [detailsError, setDetailsError] = useState('');
  const detailsInput = useRef();

  async function sendReport() {
    try {
      const featureCollectionRef = collection(db, 'reports', user.uid, 'entries');
      const featureObj = {
        ...report,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await addDoc(featureCollectionRef, featureObj);
      setUserData((prev) => ({ ...prev, reports: [featureObj, ...prev.featureRequests] }));
      setReport({
        title: '',
        details: '',
      });
    } catch (err) {
      console.error(err);
    }
  }

  function checkIsAbleToReport() {
    if (!report.details.trim()) {
      setDetailsError('Please add details');
      detailsInput.current.focus();
      return;
    } else if (report.details.trim().length < 20) {
      setDetailsError('Please add some more details');
      detailsInput.current.focus();
      return;
    }

    const requestPromise = sendReport();
    toast.promise(requestPromise, {
      loading: 'Sending report...',
      success: 'Report sent',
      error: 'Report Failed',
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h3 className="mb-2 flex gap-2 pl-1 text-2xl">
        <span>Report a bug</span>
      </h3>
      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="pl-1" htmlFor="feature-title">
            Report title
          </label>
          <input onChange={(e) => setReport((prev) => ({ ...prev, title: e.target.value }))} value={report.title} type="text" id="feature-title" className="w-full min-w-0 rounded-lg border border-transparent bg-(--textarea-bg) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Add feature title here" autoComplete="off" />
        </div>

        <div className="grid gap-2">
          <label htmlFor="feature-details" className="pl-1">
            Tell us if something isn’t working properly
          </label>
          <textarea
            ref={detailsInput}
            onChange={(e) => {
              setDetailsError('');
              setReport((prev) => ({ ...prev, details: e.target.value }));
            }}
            value={report.details}
            id="feature-details"
            className="min-h-[150px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)"
            placeholder="Enter your message"
          ></textarea>
          <span className={`block overflow-hidden text-sm font-light text-red-500 transition-[height] duration-150 ${detailsError ? 'h-[20px]' : 'h-0'}`}>{detailsError}</span>
        </div>

        <button onClick={checkIsAbleToReport} className="w-full rounded-lg bg-red-200 py-2 shadow">
          Send
        </button>
      </div>

      <div className="mt-8 space-y-2">
        <h3 className="mb-2 pl-1 text-xl">Previous reports</h3>
        {userData.reports.length > 0 ? (
          <div className="space-y-3">
            {userData.reports.map((f, i) => {
              const { title, details, createdAt, status } = f;

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
                  key={`featureKey${i}`}
                  className="flex items-start gap-4 rounded-lg bg-(--primary) p-3 shadow"
                >
                  <div className="flex-5 space-y-2">
                    <h4 className="text-lg leading-6 underline underline-offset-2">{title.trim() || 'Untitled'}</h4>
                    <p className="long-text leading-5 font-light">{details}</p>
                  </div>
                  <div className="relative grid h-auto flex-2 justify-items-center rounded-md border border-zinc-100 py-0.5 text-center text-xs font-light sm:text-sm">
                    <span className="font-normal capitalize">{status}</span>
                    <span className="opacity-80">{format(createdAt.toDate() || new Date(), 'd MMM y')}</span>

                    <span className={`absolute top-0 right-0 size-[20px] translate-x-1/2 -translate-y-1/2`}>
                      {status === 'pending' && (
                        <span className="grid size-full place-items-center rounded-md bg-zinc-300 text-black">
                          <ClockFading size="14" color="currentColor" strokeWidth="2" />
                        </span>
                      )}
                      {status === 'reviewing' && (
                        <span className="grid size-full place-items-center rounded-md bg-yellow-300 text-black">
                          <ScanEye size="14" color="currentColor" strokeWidth="2" />
                        </span>
                      )}
                      {status === 'resolved' && (
                        <span className="grid size-full place-items-center rounded-md bg-emerald-300 text-black">
                          <BadgeCheck size="14" color="currentColor" strokeWidth="2" />
                        </span>
                      )}
                      {status === 'dismissed' && (
                        <span className="grid size-full place-items-center rounded-md bg-red-300 text-black">
                          <Ban size="14" color="currentColor" strokeWidth="2" />
                        </span>
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-lg bg-(--primary) py-2 text-center shadow">
            <span className="opacity-70">Your report list will appear here</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default ReportField;
