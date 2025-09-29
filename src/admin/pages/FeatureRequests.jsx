import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchRequestOrReport } from '../helpers/fetchAdminData';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';

function FeatureRequests() {
  const [requestStatus, setRequestStatus] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [reacting, setReacting] = useState(null);

  useEffect(() => {
    setRequestsLoading(true);
    (async () => {
      try {
        const data = await fetchRequestOrReport('features', requestStatus);
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setRequestsLoading(false);
      }
    })();
  }, [requestStatus]);

  return (
    <div>
      <h2 className="px-2 py-4 text-xl">Feature requests</h2>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'reviewing', 'implemented', 'rejected', 'working'].map((btn) => (
            <button key={`btn${btn}`} onClick={() => setRequestStatus(btn)} className={`rounded-md bg-white px-3 py-1 shadow-xs outline-2 transition-colors ${requestStatus === btn ? 'outline-black/20' : 'outline-transparent pointer-fine:hover:outline-black/10'}`}>
              <span className="capitalize">{btn}</span>
            </button>
          ))}
        </div>

        {requestsLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="divide-y divide-(--slick-border) overflow-hidden rounded-xl bg-white shadow">
            {requests.length < 1 ? (
              <div className="grid place-items-center rounded-lg bg-white py-2 text-center shadow">
                <span className="font-light opacity-80">No '{requestStatus}' requests.</span>
              </div>
            ) : (
              <>
                {requests.map((req, i) => {
                  console.log(req);
                  const { createdAt, picture, request, status, uid, user } = req;
                  const { username } = user;
                  return (
                    <div key={`${uid}${i}`} className="relative flex items-center justify-between px-4 py-2 active:bg-zinc-100 pointer-fine:hover:bg-zinc-100">
                      <button onClick={() => setReacting(req)} className="absolute inset-0 z-1"></button>
                      <div className="flex items-center gap-3">
                        <div className="size-[35px] overflow-hidden rounded-full">
                          <div className="size-full">{picture ? <img className="size-full object-cover object-center" src={picture} alt={`${username} profile picture`} /> : <ProfilePlaceholderSvg className="size-full fill-zinc-800" />}</div>
                        </div>

                        <div className="leading-5">
                          <h4>{username}</h4>
                          <span className="text-sm opacity-70">Request date: {format(createdAt, 'd MMM y')}</span>
                        </div>
                      </div>

                      <p>{request.title}</p>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {reacting && (
          <motion.div onMouseDown={() => setReacting(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-black/30 p-4">
            <motion.div onMouseDown={(e) => e.stopPropagation()} initial={{ y: '50px' }} animate={{ y: 0 }} exit={{ y: '50px', opacity: 0 }} className="w-full max-w-[840px] rounded-xl bg-white p-4">
              {(() => {
                const { createdAt, picture, request, status, uid, user } = reacting;
                const { username, joinDate } = user;
                const { title, body } = request;

                return (
                  <div className="gap-6 max-md:space-y-8 md:flex">
                    <div className="flex-6 space-y-2">
                      <h3 className="w-fit text-lg leading-6 font-medium">{title.trim() || 'Untitled'}</h3>
                      <div>
                        <p className="leading-5 min-h-[50px]">{body}</p>
                        <span className="text-xs font-light opacity-70 sm:text-sm">
                          {format(createdAt, 'd MMMM y')}, {format(createdAt, 'h:mm a')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4>Mark as</h4>
                        <div className="flex flex-wrap gap-2">
                          {['pending', 'reviewing', 'implemented', 'rejected', 'working'].map((btn) => (
                            <button key={`btn${btn}`} onClick={() => ''} className={`border border-(--slick-border) rounded-md bg-(--main-bg) px-3 py-1 text-sm shadow-xs outline-2 transition-colors ${status === btn ? 'outline-black/20' : 'outline-transparent pointer-fine:hover:outline-black/10'}`}>
                              <span className="capitalize">{btn}</span>
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
                          <textarea id="notify-textarea" placeholder="Write text as notification body" className="min-h-[70px] w-full min-w-0 rounded-lg border-1 border-transparent bg-(--main-bg) px-3 py-2 outline-none focus:border-(--input-focus-border)"></textarea>
                        </div>
                        <button className="bg-(--main-bg) border border-(--slick-border) shadow-xs px-2 text-sm py-1 rounded-md">Notify</button>
                      </div>
                    </div>
                  </div>
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
