import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { listenRequestOrReport, updateFeatureOrReportStatus } from '../helpers/fetchAdminData';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import toast from 'react-hot-toast';
import GetStatus from '../../components/helpers/GetStatus';

function FeatureRequests() {
  const [requestStatus, setRequestStatus] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [reacting, setReacting] = useState(null);

  useEffect(() => {
    setRequestsLoading(true);

    const unsubscribe = listenRequestOrReport('features', requestStatus, (data) => {
      setRequests(data);
      setRequestsLoading(false);
    });

    return () => unsubscribe();
  }, [requestStatus]);

  function updateStatus(docId, status) {
    const promise = updateFeatureOrReportStatus('features', docId, status);
    toast.promise(promise, {
      loading: 'Status updating',
      success: () => {
        setReacting((prev) => ({ ...prev, status }));
        return `Status updated to ${status}`;
      },
      error: 'Status update failed',
    });
  }

  return (
    <div>
      <h2 className="px-2 py-4 text-xl">Feature requests</h2>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {['all', 'pending', 'reviewing', 'implemented', 'rejected', 'working'].map((btnText) => (
            <button key={`btn${btnText}`} onClick={() => setRequestStatus(btnText)} className={`relative rounded-md bg-white px-3 py-1 text-sm shadow-xs outline-2 transition-colors ${requestStatus === btnText ? 'outline-black/20' : 'outline-transparent pointer-fine:hover:outline-black/10'}`}>
              <span className="absolute top-0 right-0 z-2 block size-[16px] translate-x-1/3 -translate-y-1/3 overflow-hidden rounded-sm">
                <GetStatus status={btnText} size="12" />
              </span>
              <span className="capitalize">{btnText}</span>
            </button>
          ))}
        </div>

        {requestsLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {requests.length < 1 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid place-items-center rounded-lg bg-white py-3 text-center shadow">
                <span className="text-sm font-light opacity-80">No '{requestStatus}' requests.</span>
              </motion.div>
            ) : (
              <div className="divide-y divide-(--slick-border) overflow-hidden rounded-xl bg-white shadow">
                {requests.map((req, i) => {
                  const { createdAt, picture, request, status, uid, user } = req;
                  const { username } = user;
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
                      key={`${uid}${i}`}
                      className="relative px-4 py-2 active:bg-zinc-100 pointer-fine:hover:bg-zinc-100"
                    >
                      <button onClick={() => setReacting(req)} className="absolute inset-0 z-1"></button>
                      <span className={`absolute top-0.5 right-0.5 overflow-hidden rounded-md shadow select-none`}>
                        <GetStatus status={status} text={status} />
                      </span>

                      <div className="flex items-center gap-3">
                        <div className="size-[35px] shrink-0 overflow-hidden rounded-full sm:size-[40px]">
                          <div className="size-full">{picture ? <img className="size-full object-cover object-center" src={picture} alt={`${username} profile picture`} /> : <ProfilePlaceholderSvg className="size-full fill-zinc-800" />}</div>
                        </div>

                        <div className="">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium max-sm:text-sm">{username}</h4>
                            <span className="text-sm font-light opacity-70 max-sm:text-xs">Request on: {format(createdAt, 'd MMM y')}</span>
                          </div>
                          <p className="line-clamp-1 max-sm:text-sm">{request.title}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {reacting && (
          <motion.div onMouseDown={() => setReacting(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-black/30 p-4">
            <motion.div onMouseDown={(e) => e.stopPropagation()} initial={{ y: '50px' }} animate={{ y: 0 }} exit={{ y: '50px', opacity: 0 }} className="relative w-full max-w-[840px] rounded-xl bg-white px-4 py-6 md:py-8">
              {(() => {
                const { docId, createdAt, picture, request, status, uid, user } = reacting;
                const { username, joinDate } = user;
                const { title, body } = request;

                return (
                  <>
                    <span className="absolute -top-2 -right-2 size-[26px] overflow-hidden rounded-md shadow-md">
                      <GetStatus status={status} size="16" />
                    </span>
                    <div className="gap-6 max-md:space-y-8 md:flex">
                      <div className="flex-6 space-y-2">
                        <h3 className="w-fit text-lg leading-6 font-medium">{title.trim() || 'Untitled'}</h3>
                        <div>
                          <p className="min-h-[50px] leading-5">{body}</p>
                          <span className="text-xs font-light opacity-70 sm:text-sm">
                            {format(createdAt, 'd MMMM y')}, {format(createdAt, 'h:mm a')}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4>Mark as</h4>
                          <div className="flex flex-wrap gap-2">
                            {['pending', 'reviewing', 'implemented', 'rejected', 'working'].map((btnText) => (
                              <button key={`btn${btnText}`} onClick={() => updateStatus(docId, btnText)} className={`relative rounded-md border border-(--slick-border) bg-(--main-bg) px-3 py-1 text-sm shadow-xs outline-2 transition-colors ${status === btnText ? 'outline-black/20' : 'outline-transparent pointer-fine:hover:outline-black/10'}`}>
                                <span className="absolute top-0 right-0 z-2 block size-[16px] translate-x-1/3 -translate-y-1/3 overflow-hidden rounded-sm">
                                  <GetStatus status={btnText} size="12" />
                                </span>
                                <span className="capitalize">{btnText}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="size-[35px] overflow-hidden rounded-full">
                            <div className="size-full">{picture ? <img className="size-full object-cover object-center" src={picture} alt={`${username} profile picture`} /> : <ProfilePlaceholderSvg className="size-full fill-zinc-800" />}</div>
                          </div>

                          <div className="grid leading-5">
                            <h4>{user.username}</h4>
                            <span className="text-xs font-light opacity-70 sm:text-sm">Joined on: {format(joinDate, 'd MMMM y')}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid gap-1">
                            <label htmlFor="notify-textarea">Notify this user</label>
                            <textarea id="notify-textarea" placeholder="Write text as notification body" className="min-h-[90px] w-full min-w-0 rounded-lg border-1 border-transparent bg-(--textarea-bg) px-3 py-2 outline-none focus:border-(--input-focus-border)"></textarea>
                          </div>
                          <button className="rounded-md border border-(--slick-border) bg-(--main-bg) px-2 py-1 text-sm shadow-xs">Notify</button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeatureRequests;
