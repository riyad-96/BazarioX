import UniModal from './UniModal';
import { format, isThisWeek, isThisYear, isToday } from 'date-fns';

function SessionDetails({ state }) {
  const { sessionDetails, setSessionDetails } = state;

  return (
    <UniModal
      onMouseDown={() => setSessionDetails(null)}
      className="absolute grid place-items-center"
      jsx={
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="rounded-md bg-(--primary) p-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg">{sessionDetails.sessionTitle?.trim?.() || 'Untitled'}</h2>
            <span>
              {(() => {
                const d = sessionDetails.sessionAt;
                const timeStr = format(d, 'h:mm a');

                if (isToday(d)) return timeStr;
                if (isThisWeek(d)) return `${timeStr}, ${format(d, 'EEE')}`;
                if (isThisYear(d)) return `${timeStr}, ${format(d, 'MMM d')}`;
                return `${timeStr}, ${format(d, 'MMM d yyyy')}`;
              })()}
            </span>
          </div>
          <p>
            Session total: <span className="font-medium">{sessionDetails.bazarList.reduce((acc, eachItem) => acc + eachItem.total, 0)} ৳</span>
          </p>
          <div className="mt-2 rounded-md bg-(--second-lvl-bg) p-2">
            {sessionDetails.bazarList.map((eachItem, i) => {
              const { id, itemName, price, quantity, unit, total, addedAt } = eachItem;
              return (
                <div key={id} className="flex justify-between rounded-md px-2 py-1 text-sm nth-[even]:bg-white">
                  <span className="grid flex-3">
                    <span>
                      {i + 1}. {itemName || '...'} {`(${price} ৳)`}
                    </span>
                    <span className="text-xs opacity-80">{format(addedAt, 'h:mm a')}</span>
                  </span>
                  <span className="grid flex-2 place-items-center text-sm">
                    <span>
                      {quantity} {unit}
                    </span>
                  </span>
                  <span className="grid flex-2 place-items-center text-sm">
                    <span>{total} ৳</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

export default SessionDetails;
