import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg, ProfilePlaceholderSvg } from '../assets/Svg';
import { useUniContexts } from '../contexts/UniContexts';
import Statistics from '../components/profile/Statistics';

function Profile() {
  const { user } = useUniContexts();
  const navigate = useNavigate();

  return (
    <div className="scrollbar-thin grid h-dvh max-w-[700px] place-items-center overflow-y-auto bg-(--main-bg) p-3">
      <div className="absolute top-0 left-0 z-10 grid h-[60px] w-full content-center bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center gap-2 select-none">
          <button onClick={() => navigate(-1)} className="grid">
            <ArrowLeftSvg size="30" />
          </button>
          <span className="text-xl">Profile</span>
        </div>
      </div>

      <div className="size-full pt-24">
        <div className="mb-4 grid justify-items-center gap-2">
          <div className="">
            <div className="size-[150px] overflow-hidden rounded-full transition-[width,height] duration-150 sm:size-[250px]">
              <ProfilePlaceholderSvg className="size-full" />
            </div>
          </div>
        </div>

        <div className="mb-8 grid justify-items-center">
          <h2 className="text-2xl">user's name</h2>
          <p className="text-sm">{user.email}</p>
        </div>

        <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button onClick={() => navigate('/account')} className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            Account
          </button>
          <button onClick={() => navigate('/feedback')} className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            Feedback & feature request
          </button>
        </div>

        <Statistics />
      </div>
    </div>
  );
}

export default Profile;
