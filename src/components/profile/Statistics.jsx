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
        <span className="font-light opacity-70">since {createdAt}</span>
        <span className="text-xs font-light opacity-70">(Joined)</span>
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid aspect-4/2 content-center justify-items-center gap-1 rounded-lg bg-(--primary) shadow">
          <span className="text-2xl opacity-70">{Math.round(stat.totalSpent()).toLocaleString()} ৳</span>
          <span>Spent</span>
        </div>
        <div className="grid aspect-4/2 content-center justify-items-center gap-1 rounded-lg bg-(--primary) shadow">
          <span className="text-2xl opacity-70">{stat.totalItems()}</span>
          <span>Items</span>
        </div>
        <div className="grid aspect-4/2 content-center justify-items-center gap-1 rounded-lg bg-(--primary) shadow">
          <span className="text-2xl opacity-70">{stat.totalSessions}</span>
          <span>Sessions</span>
        </div>
        <div className="grid aspect-4/2 content-center justify-items-center gap-1 rounded-lg bg-(--primary) shadow">
          <span className="text-2xl opacity-70">{stat.lastSession}</span>
          <span>Last session</span>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
