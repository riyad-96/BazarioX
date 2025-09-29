import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../../configs/firebase';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star } from 'lucide-react';

function Dashboard() {
  const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
  const [dasboardData, setDashboardData] = useState({
    totalUser: 0,
    newThisMonth: 0,
    ratingCount: 0,
    averageRating: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersArray = usersSnap.docs.map((res) => ({ uid: res.id, ...res.data() }));
        // total users
        const totalUser = usersArray.length;

        // new this month
        const newThisMonth = usersArray.filter((user) => format(user.joinDate.toDate(), 'M') === format(new Date(), 'M')).length;

        // rating
        const feedbacksSnap = await getDocs(collection(db, 'feedbacks'));
        const feedbacks = feedbacksSnap.docs.map((res) => res.data());
        const ratingCount = feedbacks.length;
        const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / ratingCount || 0;

        setDashboardData({ totalUser, newThisMonth, ratingCount, averageRating });
      } catch (err) {
        console.error(err);
      } finally {
        setDashboardDataLoading(false);
      }
    })();
  }, []);

  return (
    <div className="">
      {dashboardDataLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="gap-3 text-nowrap max-sm:space-y-3 sm:flex">
          <div className="grid flex-1 space-y-4 rounded-xl bg-white p-4 pb-8 shadow">
            <h4 className="text-center">User stats</h4>
            <div className="flex items-center text-zinc-700">
              <div className="grid flex-1 text-center">
                <span className="text-3xl">{dasboardData.totalUser}</span>
                <span>Users</span>
              </div>

              <span className="h-full w-[1px] bg-zinc-200"></span>

              <div className="grid flex-1 text-center">
                <span className="text-3xl">{dasboardData.newThisMonth}</span>
                <span>New this month</span>
              </div>
            </div>
          </div>

          <div className="grid flex-1 space-y-4 rounded-xl bg-white p-4 pb-8 shadow">
            <h4 className="text-center">App ratings</h4>
            <div className="flex items-center text-zinc-700">
              <div className="grid flex-1 text-center">
                <span className="flex items-center justify-center gap-2 text-3xl">
                  <span>{dasboardData.averageRating}</span>
                  <span className="text-yellow-400">
                    <Star size="30" fill="currentColor" />
                  </span>
                </span>
                <span>Average stars</span>
              </div>

              <span className="h-full w-[1px] bg-zinc-200"></span>

              <div className="grid flex-1 text-center">
                <span className="text-3xl">{dasboardData.ratingCount}</span>
                <span>Rated</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
