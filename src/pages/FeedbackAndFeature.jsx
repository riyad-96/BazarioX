import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../assets/Svg';
import { useState } from 'react';
import { Home } from 'lucide-react';
import GetSvg from '../components/helpers/GetSvg';

function FeedbackAndFeature() {
  const navigate = useNavigate();

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-(--main-bg)">
      <div>
        <div className="flex h-[60px] bg-(--main-bg) px-3">
          <div className="mx-auto flex w-full max-w-[700px] items-center justify-between gap-2 select-none">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="grid">
                <ArrowLeftSvg size="30" />
              </button>
              <span className="text-xl">Feedback & feature request</span>
            </div>

            <button onClick={() => navigate('/')} className="rounded-lg p-2 shadow max-sm:p-1.5">
              <Home size="20" />
            </button>
          </div>
        </div>

        <div className="px-3 pt-8 pb-4">
          <div className="mx-auto max-w-[700px]">
            <div className="grid divide-(--slick-border) overflow-hidden rounded-lg bg-(--primary) shadow max-sm:divide-y sm:flex sm:divide-x">
              <NavLink to={`/profile/feedback-reports`} end replace className={({ isActive }) => `flex items-center gap-4 px-6 py-2 sm:flex-1 sm:justify-center ${isActive && 'bg-zinc-200'}`}>
                <span>
                  <GetSvg name="feedback" size="20" />
                </span>
                <span className="capitalize">Feedback</span>
              </NavLink>

              <NavLink to={`/profile/feedback-reports/feature`} replace className={({ isActive }) => `flex items-center gap-4 px-6 py-2 sm:flex-1 sm:justify-center ${isActive && 'bg-zinc-200'}`}>
                <span>
                  <GetSvg name="feature" size="20" />
                </span>
                <span className="capitalize">Feature</span>
              </NavLink>

              <NavLink to={`/profile/feedback-reports/report`} replace className={({ isActive }) => `flex items-center gap-4 px-6 py-2 sm:flex-1 sm:justify-center ${isActive && 'bg-zinc-200'}`}>
                <span>
                  <GetSvg name="report" size="20" />
                </span>
                <span className="capitalize">Report</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto px-3 pt-2 pb-16">
        <div className="mx-auto max-w-[700px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default FeedbackAndFeature;
