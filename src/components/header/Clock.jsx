import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';

function Clock() {
  const [tick, setTick] = useState(0);
  const tickInterval = useRef();
  useEffect(() => {
    tickInterval.current = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(tickInterval.current);
  }, []);

  return (
    <span key={tick} className="text-sm select-none">
      {format(new Date(), 'h:mm aa')}
    </span>
  );
}

export default Clock;
