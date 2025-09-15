import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { useUniContexts } from '../../contexts/UniContexts';
import { signOut } from 'firebase/auth';
import { auth } from '../../configs/firebase';

function Header({ className }) {
  const { user, isUserDataLoading, setAllMonthData, setCurrentSession } = useUniContexts();

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

  return (
    <div className={`flex items-center border-b-1 border-(--slick-border) bg-[#F4F4F4] ${className}`}>
      <div className="flex w-full items-center justify-between px-2">
        <span onClick={() => window.location.reload()} className="text-xl font-medium select-none">
          KitzoBazar
        </span>
        <div className="relative flex items-center gap-4">
          <AnimatePresence>
            {!isUserDataLoading && (
              <motion.span
                initial={{
                  scale: 1.2,
                }}
                animate={{
                  scale: 1,
                }}
                className={`pointer-events-none absolute top-0 left-0 z-10 flex size-[8px] rounded-full ${user ? 'bg-green-500' : 'bg-yellow-500'}`}
              ></motion.span>
            )}
          </AnimatePresence>
          <div
            data-dropdown-trigger
            onClick={() => {
              if (isUserDataLoading) return;
              if (isDropdownOpen) {
                setIsDropdownOpen(false);
                return;
              }
              setIsDropdownOpen(true);
            }}
            className={`${isUserDataLoading && 'animate-[outline-effect_1300ms_infinite] outline'} relative size-[30px] rounded-full bg-zinc-300`}
          >
            <div className="size-full overflow-hidden rounded-full bg-zinc-100">
              <ProfilePlaceholderSvg className="size-full fill-zinc-800" />
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
                    {user && (
                      <button onClick={() => {}} className="flex px-3 py-2">
                        Profile
                      </button>
                    )}
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
                    {user && (
                      <button
                        onClick={async () => {
                          try {
                            await signOut(auth);
                            localStorage.clear();
                            setAllMonthData([]);
                            setCurrentSession({ sessionTitle: '', bazarList: [] });
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="flex px-3 py-2"
                      >
                        Logout
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
  );
}

export default Header;
