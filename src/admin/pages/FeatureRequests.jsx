import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function FeatureRequests() {
  const [requestStatus, setRequestStatus] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (requestStatus === 'all') {
        console.log(requestStatus);
        
      } else {
        console.log(requestStatus);
      }
    })();
  }, [requestStatus]);

  return (
    <div>
      <h2 className="px-2 py-4 text-xl">Feature requests</h2>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'reviewing', 'implemented', 'rejected', 'working'].map((btn) => (
            <button key={`btn${btn}`} onClick={() => setRequestStatus(btn)} className={`rounded-md bg-white px-3 py-1 shadow-xs outline-2 transition-colors ${requestStatus === btn ? 'outline-black/20' : 'outline-transparent pointer-fine:hover:outline-black/10'}`}>
              <span className="capitalize">{btn}</span>
            </button>
          ))}
        </div>

        {requestsLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <div>{}</div>
        )}
      </div>
    </div>
  );
}

export default FeatureRequests;
