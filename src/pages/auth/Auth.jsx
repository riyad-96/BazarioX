import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../../assets/Svg';

function Auth() {
  const navigate = useNavigate();

  return (
    <div className="relative grid h-dvh max-w-[700px] mx-auto place-items-center overflow-y-auto bg-(--main-bg) px-2 py-8">
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 py-1 pr-2.5 pl-1 text-sm">
        <ArrowLeftSvg size="20" />
        <span>Go back</span>
      </button>
      <div className="w-full max-w-[400px] p-3 pb-22">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
