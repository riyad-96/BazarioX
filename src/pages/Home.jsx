import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import TabBar from '../components/nav/TabBar';

function Home() {
  return (
    <div className="relative grid h-full grid-rows-[50px_1fr_60px] overflow-hidden border-(--slick-border) [@media(width>=700px)]:border-r [@media(width>=700px)]:border-l">
      <Header className="" />
      <div className="scrollbar-thin overflow-y-auto px-2">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}

export default Home;
