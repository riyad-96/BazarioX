import { Outlet } from 'react-router-dom';
import { useUniContexts } from './contexts/UniContexts';

function App() {
  const { clickDisabled } = useUniContexts();
  return (
    <div className="mx-auto h-dvh max-w-[700px]">
      {clickDisabled && <div className="fixed inset-0 z-[100000] cursor-not-allowed"></div>}
      <Outlet />
    </div>
  );
}

export default App;
