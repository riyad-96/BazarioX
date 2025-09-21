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
    <div className="grid h-dvh max-w-[700px] grid-rows-[1fr_auto] bg-(--main-bg)">
      <div className="grid h-[60px] bg-(--main-bg) px-2">
        <div className="mx-auto flex w-full max-w-[700px] items-center gap-2 select-none">
          <button onClick={() => navigate(-1)} className="grid">
            <ArrowLeftSvg size="30" />
          </button>
          <span className="text-xl">Feedback & feature request</span>
        </div>
      </div>

      <div className="scrollbar-thin size-full overflow-y-auto px-3 py-8">
        <div className="space-y-5">
          <Ratings state={{ starsCount }} func={{ handleStarCount }} />
          <ReportAndFeature />
        </div>
      </div>
    </div>
  );
}

export default FeedbackAndFeature;
