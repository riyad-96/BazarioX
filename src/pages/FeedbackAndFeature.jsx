import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../assets/Svg';
import { StarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Ratings from '../feedbackandfeatures/Ratings';
import ReportAndFeature from '../feedbackandfeatures/ReportAndFeature';

function FeedbackAndFeature() {
  const navigate = useNavigate();

  const [starsCount, setStarsCount] = useState([]);

  function handleStarCount(e) {
    const stars = +e.target.closest('[data-star-id]').dataset.starId;

    if (starsCount.length === stars) {
      setStarsCount([]);
      return;
    }
    setStarsCount(Array.from({ length: stars }).map((_, i) => i + 1));
  }

  return (
    <div className="grid h-dvh max-w-[700px] grid-rows-[1fr_auto] bg-(--main-bg) p-3">
      <div className="absolute top-0 left-0 z-10 grid h-[60px] w-full content-center bg-(--main-bg) px-3">
        <div onClick={() => navigate(-1)} className="mx-auto flex w-full max-w-[700px] items-center gap-4 select-none">
          <button className="grid">
            <ArrowLeftSvg size="36" />
          </button>
          <span className="text-2xl">Feedback & feature request</span>
        </div>
      </div>

      <div className="scrollbar-thin size-full overflow-y-auto pt-24 pb-8">
        <div className="space-y-5">
          <Ratings state={{ starsCount }} func={{ handleStarCount }} />
          <ReportAndFeature />
        </div>
      </div>

      <div className="grid bg-(--main-bg) pt-4 pb-2">
        <button className="rounded-lg bg-(--second-lvl-bg) py-2 shadow">Send</button>
      </div>
    </div>
  );
}

export default FeedbackAndFeature;
