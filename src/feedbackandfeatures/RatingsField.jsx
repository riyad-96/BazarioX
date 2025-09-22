import { StarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUniContexts } from '../contexts/UniContexts';

function RatingsField() {
  const { userData } = useUniContexts();

  const [starsCount, setStarsCount] = useState(Array.from({ length: userData.rating }).map((_, i) => i + 1));

  function handleStarCount(e) {
    const stars = +e.target.closest('[data-star-id]').dataset.starId;
    if (starsCount.length === stars) {
      setStarsCount([]);
      return;
    }
    setStarsCount(Array.from({ length: stars }).map((_, i) => i + 1));
  }

  // send feedback
  async function sendFeedBack(feedback) {
    try {
      console.log(feedback);
    } catch (err) {
      console.error(err);
    }
  }

  const [commentText, setCommentText] = useState('');
  const [ratingErr, setRatingErr] = useState('');

  function checkFeedbackAndSend() {
    if (starsCount.length < 1) {
      setRatingErr('Don’t forget to choose your rating.');
      return;
    }

    const feedBackPromise = sendFeedBack({ stars: starsCount.length, comment: commentText });
    toast.promise(feedBackPromise, {
      loading: 'Saving...',
      success: 'Feedback sent',
      error: 'Sending feedback failed',
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="pl-1">
        <h2 className="text-3xl">Give feedback</h2>
        <span className="opacity-80">Please share you experience about our app</span>
      </div>

      <div className="">
        <h4 className="mb-2 flex items-center gap-2 pl-1">Ratings</h4>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.button
              onClick={(e) => {
                setRatingErr('');
                handleStarCount(e);
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ scale: { type: 'spring', stiffness: 900, damping: 20 } }}
              key={`btn${i}`}
              data-star-id={i + 1}
              className={`px-2 ${starsCount.includes(i + 1) ? 'text-yellow-400' : 'text-zinc-300'}`}
            >
              <StarIcon fill="currentColor" size="30" color="currentColor" />
            </motion.button>
          ))}
        </div>

        <p className={`overflow-hidden pl-2 text-sm font-light text-red-500 transition-[height,margin] duration-150 ${ratingErr ? 'mt-2 h-[20px]' : 'mt-0 h-0'}`}>{ratingErr}</p>
      </div>

      <div className="grid">
        <label htmlFor="comment" className="mb-2 flex items-center gap-2 pl-1">
          <span>Comment</span>
          <span className="opacity-70">(optional)</span>
        </label>
        <textarea onChange={(e) => setCommentText(e.target.value)} value={commentText} id="comment" className="min-h-[200px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) p-3 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Enter your message"></textarea>
      </div>

      <button onClick={checkFeedbackAndSend} className="w-full rounded-lg bg-green-200 py-2 shadow">
        Send
      </button>
    </motion.div>
  );
}

export default RatingsField;
