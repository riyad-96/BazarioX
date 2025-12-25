import { Outlet } from 'react-router-dom';

function Auth() {
  return (
    <div className="grid h-dvh items-center justify-items-center overflow-y-auto p-4">
      <h1 className="-auto fixed top-4 left-6 w-fit text-2xl font-medium">Bazario</h1>

      <div className="mx-auto grid w-full max-w-[450px] pt-16 pb-28">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
