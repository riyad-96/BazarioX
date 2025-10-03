import { useUniContexts } from '../../contexts/UniContexts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg, ProfilePlaceholderSvg } from '../../assets/Svg';
import Statistics from './Statistics';
import { motion } from 'motion/react';
import { CircleUser, Home, MessageCircleMore, UserLock } from 'lucide-react';

function ProfileIndex() {
  const { user, userData, userDataLoading, isAdmin, allMonthData } = useUniContexts();
  const navigate = useNavigate();

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-(--main-bg)">
      <div className="flex h-[60px] bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="grid">
              <ArrowLeftSvg size="30" />
            </button>
            <span className="text-xl">Profile</span>
          </div>

          <button onClick={() => navigate('/')} className="rounded-lg p-2 shadow max-sm:p-1.5">
            <Home size="20" />
          </button>
        </div>
      </div>

      <div className="scrollbar-thin size-full overflow-y-auto px-3 pt-24 pb-8">
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 grid justify-items-center gap-2">
            <div onClick={() => navigate('/profile/account')} className="size-[150px] overflow-hidden rounded-full shadow transition-[width,height] duration-150 sm:size-[250px]">
              {!userDataLoading ? (
                <>{userData.pictures.length < 1 ? <ProfilePlaceholderSvg className="size-full fill-zinc-800" /> : <motion.img initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="size-full object-cover object-center" src={userData.pictures.find((p) => p.isSelected).url} alt={`${userData.username} profile photo`} />}</>
              ) : (
                <>
                  <span className="block size-full animate-pulse bg-zinc-400"></span>
                </>
              )}
            </div>
          </div>

          <div className="mb-8 grid justify-items-center">
            <h2 className="flex text-2xl">
              {userDataLoading
                ? '...'
                : (() => {
                    if (!userData.username) return 'Unknown';
                    const arr = userData.username.split('');
                    return arr.map((char, i) => (
                      <motion.span
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: i * 0.05,
                        }}
                        key={char + i}
                        className="block"
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ));
                  })()}
            </h2>
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm">
              {user?.email || "user's email here"}
            </motion.p>
          </div>

          {isAdmin() && (
            <div className="mb-4 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
              <button onClick={() => navigate('/admin')} className="flex items-center gap-4 px-6 py-2.5 active:bg-(--second-lvl-bg) pointer-fine:hover:bg-(--second-lvl-bg)">
                <span>
                  <UserLock size="20" />
                </span>
                <span>Admin panel</span>
              </button>
            </div>
          )}

          <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
            <button onClick={() => navigate('/profile/account')} className="flex items-center gap-4 px-6 py-2.5 active:bg-(--second-lvl-bg) pointer-fine:hover:bg-(--second-lvl-bg)">
              <span>
                <CircleUser size="20" />
              </span>
              <span>Account</span>
            </button>
            <button onClick={() => navigate('/profile/feedback-reports')} className="flex items-center gap-4 px-6 py-2.5 active:bg-(--second-lvl-bg) pointer-fine:hover:bg-(--second-lvl-bg)">
              <span>
                <MessageCircleMore size="20" />
              </span>
              <span>Feedback & feature requests</span>
            </button>
          </div>

          {allMonthData.length > 0 ? (
            <Statistics />
          ) : (
            <div className="flex justify-center rounded-lg bg-(--primary) p-3 text-center shadow">
              <span className="font-light opacity-70 max-sm:text-sm">Please add at least one session to see statistics !</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileIndex;
