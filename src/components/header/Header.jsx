import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ className }) {
  const navigate = useNavigate();
  return (
    <div className={`flex border-b-1 border-(--slick-border) items-center bg-[#F4F4F4] ${className}`}>
      <div className="flex w-full items-center justify-between px-2">
        <span onClick={() => window.location.reload()} className="text-2xl font-medium select-none">
          KitzoBazar
        </span>
        <div className="size-[35px] rounded-full bg-zinc-300"></div>
      </div>
    </div>
  );
}

export default Header;
