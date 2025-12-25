import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="grid h-dvh bg-(--main-bg)">
      <h1 className="fixed top-4 left-6 w-fit text-2xl font-medium">Bazario</h1>

      <div className="mx-auto grid w-full max-w-[500px] content-center justify-items-center gap-4">
        <span>Page not found <span className="text-orange-400">!</span></span>
        <button className="w-[170px] rounded-full bg-(--primary) py-3 text-sm shadow" onClick={() => navigate('/', { replace: true })}>
          Home
        </button>
      </div>
    </div>
  );
}

export default PageNotFound;
