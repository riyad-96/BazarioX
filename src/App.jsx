import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="mx-auto h-dvh max-w-[700px]">
      <Outlet />
    </div>
  );
}

export default App;
