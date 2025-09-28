import { motion } from 'motion/react';
import Clock from '../../components/header/Clock';
import { useUniContexts } from '../../contexts/UniContexts';
import { ProfilePlaceholderSvg } from '../../assets/Svg';
import { useNavigate } from 'react-router-dom';
import { PanelLeftOpen } from 'lucide-react';

function NavBar({ state }) {
  const { setSidebarOpen } = state;

  const { userData, userDataLoading } = useUniContexts();
  const navigate = useNavigate();

  return (
    <div className="h-[45px] transition-[height] duration-150 md:h-[50px]">
      <div className="flex h-full gap-2">
        <div className="h-full overflow-hidden rounded-xl bg-white shadow lg:hidden">
          <motion.button onClick={() => setSidebarOpen(true)} whileTap={{ scale: 0.9 }} transition={{ scale: { type: 'spring', stiffness: 900, damping: 25 } }} className="size-full px-3 md:px-4 transition-[padding] duration-150 text-zinc-600 hover:text-black">
            <PanelLeftOpen size="20" />
          </motion.button>
        </div>

        <div className="flex flex-1 items-center justify-between rounded-xl bg-white px-3 shadow">
          <div>
            <Clock />
          </div>

          <div className="relative size-[30px] overflow-hidden rounded-full bg-white transition-[width,height] duration-150 md:size-[35px]">
            <span className="absolute inset-0 z-5" onClick={() => navigate('/profile')}></span>
            {userDataLoading ? (
              <>
                <span className="block size-full animate-pulse bg-zinc-400"></span>
              </>
            ) : (
              <>{userData.pictures.length < 1 ? <ProfilePlaceholderSvg className="size-full fill-zinc-800" /> : <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="size-full object-cover object-center" src={userData.pictures.find((p) => p.isSelected).url} alt={`${userData.username} profile photo`} />}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
