import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUniContexts } from '../../contexts/UniContexts';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function Feedbacks() {
  const { allUsers } = useUniContexts();
  const [rating, setRating] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const feedbacksSnap = await getDocs(query(collection(db, 'feedbacks')), orderBy('ratedAt', 'desc'));
        const feedbacks = feedbacksSnap.docs.map((res) => ({ uid: res.id, ...res.data() }));

        const averageRatings = feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / feedbacks.length;
        setRating({
          average: averageRatings,
          count: feedbacks.length,
        });

        const feedbacksWithUserData = await Promise.all(
          feedbacks.map(async (feedback) => {
            const picsSnap = await getDocs(query(collection(db, 'users', feedback.uid, 'pictures')), where('isSelected', '==', true));
            const username = (await getDoc(doc(db, 'users', feedback.uid))).data().username;
            const picture = picsSnap.docs.length < 1 ? null : picsSnap.docs[0].data().url;
            return {
              uid: feedback.uid,
              username,
              feedback,
              picture,
            };
          }),
        );

        setFeedbacks(feedbacksWithUserData);
      } catch (err) {
        console.error(err);
      } finally {
        setFeedbacksLoading(false);
      }
    })();
  }, []);

  const [feedbackPreview, setFeedbackPreview] = useState(null);

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <h2 className="text-xl">Feedbacks</h2>
        {rating && (
          <span className="flex items-center gap-1 max-sm:text-sm">
            <span className="flex items-center gap-1">
              <span>Average: {rating.average}</span>
              <span className="text-yellow-400">
                <Star fill="currentColor" size="16" />
              </span>
            </span>
            <span>Rated: {rating.count} users</span>
          </span>
        )}
      </div>

      {feedbacksLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="divide-y divide-(--slick-border) overflow-hidden rounded-xl bg-white shadow">
          {feedbacks.map((fb) => {
            const { feedback, picture, uid, username } = fb;
            const { rating } = feedback;

            return (
              <div key={uid} className="relative flex items-center justify-between px-4 py-2 active:bg-zinc-100 pointer-fine:hover:bg-zinc-100">
                <button onClick={() => setFeedbackPreview(fb)} className="absolute inset-0 z-1"></button>
                <div className="flex items-center gap-3">
                  <div className="size-[35px] overflow-hidden rounded-full">
                    <div className="size-full">{picture ? <img className="size-full object-cover object-center" src={picture} alt={`${username} profile picture`} /> : <ProfilePlaceholderSvg className="size-full fill-zinc-800" />}</div>
                  </div>

                  <div className="leading-5">
                    <h4>{username}</h4>
                    <span className="text-sm opacity-70">{format(feedback.ratedAt.toDate(), 'd MMM y')}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={`star${i}`} className="grid text-yellow-400">
                      <Star fill="currentColor" />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {feedbackPreview && (
          <motion.div onMouseDown={() => setFeedbackPreview(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 grid place-items-center bg-black/30 p-4">
            <motion.div onMouseDown={(e) => e.stopPropagation()} initial={{ y: '50px' }} animate={{ y: 0 }} exit={{ y: '50px', opacity: 0 }} className="w-full max-w-[450px] space-y-4 rounded-xl bg-white p-3">
              {(() => {
                const { feedback, picture, uid, username } = feedbackPreview;
                const { comment, rating } = feedback;
                return (
                  <>
                    <div key={uid} className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-[35px] overflow-hidden rounded-full">
                          <div className="size-full">{picture ? <img className="size-full object-cover object-center" src={picture} alt={`${username} profile picture`} /> : <ProfilePlaceholderSvg className="size-full fill-zinc-800" />}</div>
                        </div>

                        <div className="leading-5">
                          <h4>{username}</h4>
                          <span className="text-sm opacity-70">{format(feedback.ratedAt.toDate(), 'd MMM y')}</span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {Array.from({ length: rating }).map((_, i) => (
                          <span key={`star${i}`} className="grid text-yellow-400">
                            <Star fill="currentColor" />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p>{comment || <span className="opacity-70">...</span>}</p>
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

export default Feedbacks;
