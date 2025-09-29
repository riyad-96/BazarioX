import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../configs/firebase';

function FeatureRequests() {
  const [requestStatus, setRequestStatus] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  async function fetchRequests(req) {
    if (req === 'all') {
      try {
        const allRequestsUserSnap = await getDocs(query(collection(db, 'features'), orderBy('createdAt', 'desc')));
        console.log(allRequestsUserSnap.docs.map((res) => res.data()));
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(requestStatus);
    }
  }

  useEffect(() => {
    fetchRequests(requestStatus);
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
