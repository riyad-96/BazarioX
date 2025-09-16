import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg, ProfilePlaceholderSvg } from '../assets/Svg';
import { useUniContexts } from '../contexts/UniContexts';

function Profile() {
  const { user } = useUniContexts();
  const navigate = useNavigate();

  return (
    <div className="relative grid h-dvh max-w-[700px] place-items-center overflow-y-auto bg-(--main-bg) p-2">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 py-1 pr-2.5 pl-1 text-sm dark:border-zinc-700 dark:bg-zinc-800">
        <ArrowLeftSvg size="20" />
        <span>Go back</span>
      </button>
      <div className="size-full pt-24">
        <div className="grid justify-items-center gap-2">
          <div>
            <div className="size-[150px] overflow-hidden rounded-full transition-[width,height] duration-150 sm:size-[250px]">
              <ProfilePlaceholderSvg className="size-full" />
            </div>
          </div>
          <p className="text-center text-sm">{user.email}</p>
        </div>
        <div>
          <h2 className="my-4 text-center text-2xl">Profile name</h2>
        </div>
      </div>
    </div>
  );
}

export default Profile;
