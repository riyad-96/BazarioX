import { BadgeCheck, Ban, ClockFading, Hammer, ScanEye } from 'lucide-react';

function GetStatus({ className = '', status, size = '14' }) {
  if (status === 'pending') {
    return (
      <span className={`grid size-full place-items-center bg-zinc-300 text-black ${className}`}>
        <ClockFading size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }
  if (status === 'reviewing') {
    return (
      <span className={`grid size-full place-items-center bg-yellow-300 text-black ${className}`}>
        <ScanEye size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  if (status === 'working') {
    return (
      <span className={`grid size-full place-items-center bg-blue-300 text-black ${className}`}>
        <Hammer size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  if (status === 'implemented') {
    return (
      <span className={`grid size-full place-items-center bg-emerald-300 text-black ${className}`}>
        <BadgeCheck size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className={`grid size-full place-items-center bg-red-300 text-black ${className}`}>
        <Ban size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }
  if (status === 'resolved') {
    return (
      <span className={`grid size-full place-items-center bg-emerald-300 text-black ${className}`}>
        <BadgeCheck size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }
  if (status === 'dismissed') {
    return (
      <span className={`grid size-full place-items-center bg-red-300 text-black ${className}`}>
        <Ban size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  return null;
}

export default GetStatus;
