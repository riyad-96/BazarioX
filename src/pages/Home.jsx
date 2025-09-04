import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import TabBar from '../components/nav/TabBar';

function Home() {
  return (
    <div className="grid h-full grid-rows-[50px_1fr_60px]">
      <Header className="" />
      <div className="px-2 overflow-y-auto home-page-body">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}

export default Home;
