import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Calc from './Calc';
import EachItem from './EachItem';
import { useUniContexts } from '../../contexts/UniContexts';
import { format } from 'date-fns';
import { useFunctionContext } from '../../contexts/FunctionContexts';
import { CloudUpload, HardDriveUpload, ListX, Trash2 } from 'lucide-react';

function Calculator() {
  const { user, isCalcExpanded, setIsCalcExpanded, currentSession, setCurrentSession } = useUniContexts();
  const { handleStoringNewSession } = useFunctionContext();

  const [item, setItem] = useState({
    id: '',
    itemName: '',
    price: '',
    unit: 'kg',
    quantity: '',
    total: '',
    addedAt: '',
  });

  function addBazarSession() {
    const newDate = new Date();

    const newSession = {
      ...currentSession,
      _synced: false,
      id: Date.now(),
      bazarList: currentSession.bazarList,
      sessionTotal: currentSession.bazarList.reduce((acc, eachItem) => acc + eachItem.total, 0),
      sessionAt: newDate,
      // month: format(newDate, 'M'),
      month: '9',
      year: format(newDate, 'y'),
    };
    handleStoringNewSession(newSession);
    setCurrentSession({
      sessionTitle: '',
      bazarList: [],
    });
  }

  return (
    <div className="min-h-full py-2">
      <div className="mb-3 space-y-2">
        <h1 className="text-xl">Bazar List</h1>
        <input onChange={(e) => setCurrentSession((prev) => ({ ...prev, sessionTitle: e.target.value }))} value={currentSession.sessionTitle} type="text" placeholder="Bazar title" className="w-full min-w-0 rounded-lg border-1 border-(--slick-border) bg-(--primary) py-1 text-center text-lg font-light transition-colors duration-150 outline-none focus:border-(--input-focus-border)" />
      </div>

      <div className={`space-y-2 transition-[padding] duration-450 ${isCalcExpanded ? 'pb-80' : 'pb-20'}`}>
        <div className="rounded-lg border border-(--slick-border) bg-(--primary) p-2 shadow-xs">
          <div className="space-y-2">
            <p>
              Items: <span className="font-medium">{currentSession.bazarList.length}</span>, Total: <span className="font-medium">{currentSession.bazarList.reduce((acc, eachItem) => eachItem.total + acc, 0)}</span> ৳
            </p>

            <div className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg)">
              {currentSession.bazarList.length < 1 && (
                <p className="grid h-[40px] place-items-center overflow-hidden rounded-md bg-(--second-lvl-bg) text-center">
                  <span className="font-light">Your items will appear here</span>
                </p>
              )}

              <AnimatePresence>
                {currentSession.bazarList.length > 0 && (
                  <motion.div className="overflow-hidden">
                    <div className="flex border-b-1 border-(--each-list-item-divider-clr) py-2 pl-6">
                      <span className="flex-3 text-center text-sm font-medium">Item</span>
                      <span className="flex-2 text-center text-sm font-medium">Price</span>
                      <span className="flex-2 text-center text-sm font-medium">Amount</span>
                      <span className="flex-2 text-center text-sm font-medium">Total</span>
                      <span className="grid flex-1 place-items-center text-center text-sm font-medium">
                        <Trash2 size="18" />
                      </span>
                    </div>

                    <div className="">
                      <AnimatePresence>
                        {currentSession.bazarList.map((eachItem, i) => (
                          <EachItem key={eachItem.id} props={{ eachItem, i, setCurrentSession }} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {currentSession.bazarList.length > 0 && (
              <div className="group mt-4 flex items-center justify-end gap-2 overflow-hidden">
                <span className="text-xs opacity-80 transition-opacity pointer-fine:opacity-0 pointer-fine:group-hover:opacity-70">Double click to -</span>
                <button
                  onDoubleClick={() => {
                    setCurrentSession((prev) => ({ ...prev, bazarList: [] }));
                  }}
                  className="flex items-center gap-2 rounded-md border border-(--slick-border) bg-(--second-lvl-bg) py-0.5 pr-3 pl-2 text-sm"
                >
                  <span>
                    <ListX size="16" />
                  </span>
                  <span>Delete</span>
                </button>
                <button onClick={addBazarSession} className="flex items-center gap-2 rounded-md border border-(--slick-border) bg-(--second-lvl-bg) py-0.5 pr-3 pl-2 text-sm">
                  <span>{user ? <CloudUpload size="16" /> : <HardDriveUpload size="16" />}</span>
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Calc props={{ isCalcExpanded, setIsCalcExpanded, item, setItem }} />
    </div>
  );
}

export default Calculator;
