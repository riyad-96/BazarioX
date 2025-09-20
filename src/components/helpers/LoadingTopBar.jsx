import { useRef } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';

export function LoadingTopBar({ color = '#3273dc' }) {
  const { progress } = useUniContexts();
  return (
    <div
      style={{
        background: color,
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '2px',
        zIndex: 100000,
        transition: `width 350ms, opacity 400ms ${progress == 100 ? '100ms' : ''}`,
        opacity: `${progress == 100 || progress == 0 ? 0 : 1}`,
      }}
    ></div>
  );
}

export function useLoadingTopBar() {
  const { setProgress } = useUniContexts();
  const interval = useRef();

  const start = (percent = 25) => {
    setProgress(percent);

    if (interval.current) clearInterval(interval.current);
    interval.current = setInterval(() => {
      if (percent <= 80) {
        percent += 0.1;
        setProgress(percent);
      }
    }, 100);
  };

  const complete = () => {
    if (interval.current) clearInterval(interval.current);
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
    }, 500);
  };

  return { start, complete };
}
