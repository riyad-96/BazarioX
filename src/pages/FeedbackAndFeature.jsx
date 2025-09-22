import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../assets/Svg';
import { useState } from 'react';
import RatingsField from '../components/feedbackandfeatures/RatingsField';
import FeatureField from '../components/feedbackandfeatures/FeatureField';
import ReportField from '../components/feedbackandfeatures/ReportField';

function FeedbackAndFeature() {
  const navigate = useNavigate();

  // tabs
  const [tab, setTab] = useState('feedback');

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-(--main-bg)">
      <div className="grid h-[60px] bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center gap-2 select-none">
          <button onClick={() => navigate(-1)} className="grid">
            <ArrowLeftSvg size="30" />
          </button>
          <span className="text-xl">Feedback & feature request</span>
        </div>
      </div>

      <div className="scrollbar-thin size-full overflow-y-auto px-3 py-8">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid divide-(--slick-border) overflow-hidden rounded-lg bg-(--primary) shadow max-sm:divide-y sm:flex sm:divide-x">
            {['feedback', 'feature', 'report'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex px-4 py-2 sm:flex-1 sm:justify-center ${tab === t && 'bg-zinc-200'}`}>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>

          <div>
            {tab === 'feedback' && <RatingsField />}
            {tab === 'feature' && <FeatureField />}
            {tab === 'report' && <ReportField />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackAndFeature;
