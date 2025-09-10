import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ className }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    function turnOffDropdown(e) {
      if (e.target.closest('[data-dropdown-trigger]')) return;

      if (!e.target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', turnOffDropdown);
    document.addEventListener('touchstart', turnOffDropdown)
    return () => {
      document.removeEventListener('mousedown', turnOffDropdown);
      document.removeEventListener('touchstart', turnOffDropdown);
    };
  }, []);

  return (
    <div className={`flex items-center border-b-1 border-(--slick-border) bg-[#F4F4F4] ${className}`}>
      <div className="flex w-full items-center justify-between px-2">
        <span onClick={() => window.location.reload()} className="text-2xl font-medium select-none">
          KitzoBazar
        </span>
        <div
          data-dropdown-trigger
          onClick={() => {
            if (isDropdownOpen) {
              setIsDropdownOpen(false);
              return;
            }
            setIsDropdownOpen(true);
          }}
          className="relative size-[35px] rounded-full bg-zinc-300"
        >
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  x: 10,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  x: 10,
                  y: -10,
                }}
                data-dropdown
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[calc(100%_+_10px)] right-0 z-15 h-[50px] w-[200px] rounded-lg border border-(--slick-border) bg-(--primary) shadow-md"
              >
                <div></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Header;
