import { BadgeCheck, Ban, ClockFading, Hammer, ScanEye } from 'lucide-react';

function GetStatus({ className = '', status, size = '14', text = '' }) {
  if (status === 'pending') {
    return (
      <span className={`size-full bg-zinc-300 text-black ${className} ${text ? 'flex items-center gap-1 px-1 py-[1px] text-xs font-light capitalize' : 'grid place-items-center'}`}>
        {text && <span>{text}</span>}
        <ClockFading size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  if (status === 'reviewing') {
    return (
      <span className={`size-full bg-yellow-300 text-black ${className} ${text ? 'flex items-center gap-1 px-1 py-[1px] text-xs font-light capitalize' : 'grid place-items-center'}`}>
        {text && <span>{text}</span>}
        <ScanEye size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  if (status === 'working') {
    return (
      <span className={`size-full bg-blue-300 text-black ${className} ${text ? 'flex items-center gap-1 px-1 py-[1px] text-xs font-light capitalize' : 'grid place-items-center'}`}>
        {text && <span>{text}</span>}
        <Hammer size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  if (status === 'implemented' || status === 'resolved') {
    return (
      <span className={`size-full bg-emerald-300 text-black ${className} ${text ? 'flex items-center gap-1 px-1 py-[1px] text-xs font-light capitalize' : 'grid place-items-center'}`}>
        {text && <span>{text}</span>}
        <BadgeCheck size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  if (status === 'rejected' || status === 'dismissed') {
    return (
      <span className={`size-full bg-red-300 text-black ${className} ${text ? 'flex items-center gap-1 px-1 py-[1px] text-xs font-light capitalize' : 'grid place-items-center'}`}>
        {text && <span>{text}</span>}
        <Ban size={size} color="currentColor" strokeWidth="2" />
      </span>
    );
  }

  return <></>;
}

export default GetStatus;
