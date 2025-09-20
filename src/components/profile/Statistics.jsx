import { useUniContexts } from '../../contexts/UniContexts';
import { format, isThisWeek } from 'date-fns';

function Statistics() {
  const { user, allMonthData } = useUniContexts();
  const createdAt = format(new Date(user?.metadata.creationTime), 'd MMMM y');

  const stat = {
    totalSpent: () => allMonthData.reduce((acc, s) => acc + s.sessionTotal, 0),
    totalItems: () => allMonthData.reduce((acc, s) => acc + s.bazarList.length, 0),
    totalSessions: allMonthData.length,
    lastSession: isThisWeek(allMonthData[0].sessionAt) ? format(allMonthData[0].sessionAt, 'EEEE') : format(allMonthData[0].sessionAt, 'd MMM y'),
  };

  return (
    <div>
      <h4 className="mb-4 flex items-center gap-2 pl-1">
        <span>Statistics</span>
        <span className="font-light opacity-70 text-sm">since {createdAt}</span>
        <span className="text-xs font-light opacity-70">(Joined)</span>
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid aspect-4/2 content-center justify-items-center rounded-lg bg-(--primary) shadow">
          <span className="text-lg opacity-70 md:text-2xl">{Math.round(stat.totalSpent()).toLocaleString()} ৳</span>
          <span className="text-sm sm:text-base">Spent</span>
        </div>
        <div className="grid aspect-4/2 content-center justify-items-center rounded-lg bg-(--primary) shadow">
          <span className="text-lg opacity-70 md:text-2xl">{stat.totalItems()}</span>
          <span className="text-sm sm:text-base">Items</span>
        </div>
        <div className="grid aspect-4/2 content-center justify-items-center rounded-lg bg-(--primary) shadow">
          <span className="text-lg opacity-70 md:text-2xl">{stat.totalSessions}</span>
          <span className="text-sm sm:text-base">Sessions</span>
        </div>
        <div className="grid aspect-4/2 content-center justify-items-center rounded-lg bg-(--primary) shadow">
          <span className="text-lg opacity-70 md:text-2xl">{stat.lastSession}</span>
          <span className="text-sm sm:text-base">Last session</span>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
