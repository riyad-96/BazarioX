import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg, ProfilePlaceholderSvg } from '../assets/Svg';
import { useUniContexts } from '../contexts/UniContexts';
import Statistics from '../components/profile/Statistics';

function Profile() {
  const { user, userData, isAdmin, allMonthData } = useUniContexts();
  const navigate = useNavigate();

  // blur the photo background

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-(--main-bg)">
      <div className="grid h-[60px] bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center gap-2 select-none">
          <button onClick={() => navigate(-1)} className="grid">
            <ArrowLeftSvg size="30" />
          </button>
          <span className="text-xl">Profile</span>
        </div>
      </div>

      <div className="scrollbar-thin size-full overflow-y-auto px-3 pt-24 pb-8">
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 grid justify-items-center gap-2">
            <div className="">
              <div onClick={() => navigate('/account')} className="size-[150px] overflow-hidden rounded-full shadow transition-[width,height] duration-150 sm:size-[250px]">
                {userData.pictures.length < 1 ? (
                  <ProfilePlaceholderSvg className="size-full fill-zinc-800" />
                ) : (
                  (() => {
                    const selectedImg = userData.pictures.find((p) => p.isSelected);

                    return <img className="size-full object-cover object-center" src={selectedImg.url} alt={`${userData.username} profile photo`} />;
                  })()
                )}
              </div>
            </div>
          </div>

          <div className="mb-8 grid justify-items-center">
            <h2 className="text-2xl">{userData.username ? `Hey, ${userData.username} !` : 'Unknown'}</h2>
            <p className="text-sm">{user?.email || "user's email here"}</p>
          </div>

          <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
            {isAdmin() && (
              <button onClick={() => navigate('/dashboard')} className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
                Dashboard
              </button>
            )}
            <button onClick={() => navigate('/account')} className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
              Account
            </button>
            <button onClick={() => navigate('/feedback')} className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
              Feedback & feature request
            </button>
          </div>

          {allMonthData.length > 0 ? (
            <Statistics />
          ) : (
            <div className="flex justify-center rounded-lg bg-(--primary) p-3 shadow">
              <span className="opacity-70">Please add at least one session to see statistics !</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
