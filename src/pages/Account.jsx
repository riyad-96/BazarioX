import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../assets/Svg';

function Account() {
  const navigate = useNavigate();

  return (
    <div className="scrollbar-thin grid h-dvh max-w-[700px] place-items-center overflow-y-auto bg-(--main-bg) p-3">
      <div className="absolute top-0 left-0 z-10 grid h-[60px] w-full content-center bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center gap-2 select-none">
          <button onClick={() => navigate(-1)} className="grid">
            <ArrowLeftSvg size="30" />
          </button>
          <span className="text-xl">Account</span>
        </div>
      </div>

      <div className="size-full pt-24">
        <div className="mb-5 space-y-4">
          <div className="aspect-3/2 overflow-hidden rounded-xl bg-zinc-200"></div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 pl-1">Profile picture</h4>
            <div className="flex gap-4">
              <div className="size-[60px] rounded-lg bg-zinc-200"></div>
              <div className="size-[60px] rounded-lg bg-zinc-200"></div>
              <div className="size-[60px] rounded-lg bg-zinc-200"></div>
            </div>
          </div>
        </div>

        <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Username</span>
            <span className="opacity-70">xxx</span>
          </button>
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Phone number</span>
            <span className="opacity-70">xxx</span>
          </button>
          <button className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Change password</span>
          </button>
        </div>

        <div className="grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">Log out</button>
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">Delete account</button>
        </div>
      </div>
    </div>
  );
}

export default Account;
