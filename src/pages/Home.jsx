import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import TabBar from '../components/nav/TabBar';
import { motion, AnimatePresence } from 'motion/react';
import { useUniContexts } from '../contexts/UniContexts';
import { useEffect, useRef, useState } from 'react';
import { useFunctionContext } from '../contexts/FunctionContexts';
import toast from 'react-hot-toast';

function Home() {
  const { unsavedSessionModal, setClickDisabled } = useUniContexts();
  const { discardLocalAndLoadCloudData, saveToCloudAndLoadCloudData } = useFunctionContext();

  const checkboxInput = useRef();

  return (
    <div className="relative grid h-full grid-rows-[50px_1fr_60px] overflow-hidden border-(--slick-border) [@media(width>=700px)]:border-r [@media(width>=700px)]:border-l">
      <AnimatePresence>
        {unsavedSessionModal && (
          <motion.div inital={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 grid place-items-center bg-black/30 dark:bg-black/70 p-4">
            <div className="w-full max-w-[400px] space-y-2 rounded-xl bg-white py-4 dark:bg-zinc-800">
              <div className="border-b border-(--slick-border) dark:border-zinc-700 px-5 pb-2">
                <h3 className="w-fit text-lg font-medium">
                  Unsaved sessions found <span className="text-yellow-500">!</span>
                </h3>
              </div>

              <div className="space-y-3 px-5">
                <div className="space-y-4">
                  <p>We noticed you have some local sessions that aren’t saved yet. Would you like to back them up to the cloud?</p>

                  <p className="relative overflow-hidden rounded-md bg-red-100 dark:bg-red-900 py-1 pl-2.5 text-sm before:absolute before:top-0 before:left-0 before:h-full before:w-[4px] before:bg-red-400 dark:before:bg-red-600">Warning: This action cannot be undone.</p>
                </div>

                <div className="relative my-6 flex w-fit items-center gap-2">
                  <span className="absolute -inset-1 rounded-md"></span>
                  <input ref={checkboxInput} type="checkbox" id="checkbox" />
                  <label htmlFor="checkbox" className="text-sm">
                    I agree, this will overwrite existing data.
                    <span className="absolute inset-0 z-1 pointer-fine:cursor-pointer"></span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => {
                      if (!checkboxInput.current.checked) {
                        checkboxInput.current.closest('div').querySelector('span').classList.add('warning-effect');
                        setTimeout(() => {
                          checkboxInput.current.closest('div').querySelector('span').classList.remove('warning-effect');
                        }, 400);
                      } else {
                        setClickDisabled(true);
                        const promise = discardLocalAndLoadCloudData();
                        toast.promise(promise, {
                          loading: 'Loading cloud data...',
                          success: 'Cloud data loaded successfully!',
                          error: 'Failed to load cloud data.',
                        });
                      }
                    }}
                    className="rounded-md border border-red-300 bg-red-200 px-2 py-0.5 text-sm dark:border-red-700 dark:bg-red-800"
                  >
                    Discard local
                  </button>
                  <button
                    onClick={() => {
                      if (!checkboxInput.current.checked) {
                        checkboxInput.current.closest('div').querySelector('span').classList.add('warning-effect');
                        setTimeout(() => {
                          checkboxInput.current.closest('div').querySelector('span').classList.remove('warning-effect');
                        }, 400);
                      } else {
                        setClickDisabled(true);
                        const promise = saveToCloudAndLoadCloudData();
                        toast.promise(promise, {
                          loading: 'Saving changes and fetching cloud data...',
                          success: 'Changes saved and cloud data updated!',
                          error: 'Failed to save changes to cloud.',
                        });
                      }
                    }}
                    className="rounded-md border border-green-400 dark:border-green-600 bg-green-200 dark:bg-green-700 px-2 py-0.5 text-sm"
                  >
                    Save to cloud
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header className="" />
      <div className="scrollbar-thin overflow-y-auto px-2">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}

export default Home;
