import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { useUniContexts } from '../../contexts/UniContexts';
import { signOut } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function Header({ className }) {
  const { user, userData, isUserDataLoading, setAllMonthData, setCurrentSession } = useUniContexts();

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    function turnOffDropdown(e) {
      if (e.target.closest('[data-dropdown-trigger]')) return;

      if (!e.target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', turnOffDropdown);
    document.addEventListener('touchstart', turnOffDropdown);
    return () => {
      document.removeEventListener('mousedown', turnOffDropdown);
      document.removeEventListener('touchstart', turnOffDropdown);
    };
  }, []);

  const [tick, setTick] = useState(0);
  const tickInterval = useRef();
  useEffect(() => {
    tickInterval.current = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(tickInterval.current);
  }, []);

  return (
    <div className={`flex items-center border-b-1 border-(--slick-border) bg-(--primary) ${className}`}>
      <div className="flex w-full items-center justify-between px-3">
        <span onClick={() => window.location.reload()} className="text-xl font-medium select-none">
          KitzoBazar
        </span>

        <div className="flex items-center gap-4">
          <span key={tick} className="text-sm select-none">
            {format(new Date(), 'h:m aa')}
          </span>
          <div className="relative flex items-center gap-4">
            {!isUserDataLoading && <span className={`pointer-events-none absolute top-0 left-0 z-10 flex size-[8px] rounded-full outline-1 outline-(--primary) dark:outline-zinc-800 ${user ? 'bg-green-500' : 'bg-yellow-500'}`}></span>}
            <div
              data-dropdown-trigger
              onClick={() => {
                if (isUserDataLoading) return;
                if (isDropdownOpen) {
                  setIsDropdownOpen(false);
                  return;
                }
                if (!user) {
                  setIsDropdownOpen(true);
                } else {
                  navigate('/profile');
                }
              }}
              className={`${isUserDataLoading && 'animate-[outline-effect_1300ms_infinite] outline'} relative size-[30px] rounded-full bg-zinc-300`}
            >
              <div className="size-full overflow-hidden rounded-full bg-zinc-100 shadow dark:bg-zinc-800">
                {userData.pictures.length < 1 ? (
                  <ProfilePlaceholderSvg className="size-full fill-zinc-800 dark:fill-zinc-300" />
                ) : (
                  (() => {
                    const selectedImg = userData.pictures.find((p) => p.isSelected);

                    return <img className="size-full object-cover object-center" src={selectedImg.url} alt={`${userData.username} profile photo`} />;
                  })()
                )}
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      x: 10,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      x: 10,
                      y: -10,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    data-dropdown
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[calc(100%_+_10px)] right-0 z-15 w-[200px] rounded-lg border border-(--slick-border) bg-(--primary) p-2 shadow-md"
                  >
                    {user && <p className="mb-2 text-center text-sm font-light">{user.email}</p>}
                    <div className="grid divide-y divide-(--slick-border) rounded-md bg-(--second-lvl-bg)">
                      {!user && (
                        <button
                          onClick={() => {
                            navigate('/auth/log-in');
                          }}
                          className="flex px-3 py-2"
                        >
                          Login/Signup
                        </button>
                      )}
                    </div>

                    <p className="mt-2 text-end text-xs">
                      Cloud sync: <span className={`${user ? 'text-green-500' : 'text-yellow-500'}`}>{user ? 'On' : 'Off'}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
