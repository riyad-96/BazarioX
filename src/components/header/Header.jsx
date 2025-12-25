import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { useUniContexts } from '../../contexts/UniContexts';
import { format } from 'date-fns';
import Clock from './Clock';

function Header() {
  const { user, userData, isUserLoading, userDataLoading } = useUniContexts();

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
    <div className="flex items-center border-b-1 border-(--slick-border) bg-(--primary) px-3">
      <div className="mx-auto flex w-full max-w-[700px] items-center justify-between">
        <span onClick={() => window.location.reload()} className="text-xl font-medium select-none">
          Bazario
        </span>

        <div className="flex items-center gap-4">
          <Clock />
          <div className="relative flex items-center gap-4">
            {!isUserLoading && <span className={`pointer-events-none absolute top-0 left-0 z-10 flex size-[8px] rounded-full outline-1 outline-(--primary) ${user ? 'bg-green-500' : 'bg-yellow-500'}`}></span>}
            <div
              data-dropdown-trigger
              onClick={() => {
                if (isUserLoading) return;
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
              className={`${userDataLoading && 'animate-[outline-effect_1300ms_infinite] outline'} relative size-[30px] rounded-full bg-zinc-300`}
            >
              <div className="size-full overflow-hidden rounded-full bg-zinc-100 shadow">
                {userDataLoading ? (
                  <>
                    <span className="block size-full animate-pulse bg-zinc-400"></span>
                  </>
                ) : (
                  <>{userData.pictures.length < 1 ? <ProfilePlaceholderSvg className="size-full fill-zinc-800" /> : <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="size-full object-cover object-center" src={userData.pictures.find((p) => p.isSelected).url} alt={`${userData.username} profile photo`} />}</>
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
