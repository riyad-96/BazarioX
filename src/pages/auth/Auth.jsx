import { Outlet } from 'react-router-dom';

function Auth() {
  return (
    <div className="grid h-dvh items-center justify-items-center overflow-y-auto p-4">
      <div className="w-full">
        <h1 className="w-fit text-2xl font-medium max-md:mx-auto md:fixed md:top-4 md:left-6">KitzoBazar</h1>

        <div className="mx-auto grid w-full max-w-[450px] py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Auth;
