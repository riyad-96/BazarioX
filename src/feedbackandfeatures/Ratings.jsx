import { StarIcon } from 'lucide-react';
import { motion } from 'motion/react';

function Ratings({ state, func }) {
  const { starsCount } = state;
  const { handleStarCount } = func;

  return (
    <>
      <div className="pl-1">
        <h2 className="text-3xl">Give feedback</h2>
        <span className="opacity-80">Please share you experience about our app</span>
      </div>

      <div className="">
        <h4 className="mb-2 flex items-center gap-2 pl-1">Ratings</h4>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.button onClick={handleStarCount} whileTap={{ scale: 0.9 }} transition={{ scale: { type: 'spring', stiffness: 900, damping: 20 } }} key={`btn${i}`} data-star-id={i + 1} className={`px-2 ${starsCount.includes(i + 1) ? 'text-yellow-400' : 'text-zinc-300'}`}>
              <StarIcon fill="currentColor" size="30" color="currentColor" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid">
        <label htmlFor="comment" className="mb-2 flex items-center gap-2 pl-1">
          <span>Comment</span>
          <span className="opacity-70">(optional)</span>
        </label>
        <textarea id="comment" className="min-h-[200px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) p-3 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Enter your message"></textarea>
      </div>
    </>
  );
}

export default Ratings;
