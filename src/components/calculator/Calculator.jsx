import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Calc from './Calc';
import EachItem from './EachItem';
import { useUniContexts } from '../../contexts/UniContexts';

function Calculator() {
  const { isCalcExpanded, setIsCalcExpanded, items, setItems, setTotalSessions, session, setSession } = useUniContexts();

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
    const newSession = {
      ...session,
      id: Date.now(),
      bazarList: items,
      sessionTotal: items.reduce((acc, eachItem) => acc + eachItem.total, 0),
      sessionAt: new Date(),
    };
    setTotalSessions((prev) => [...prev, newSession]);
    setItems([]);
    setSession({
      id: '',
      sessionTitle: '',
      sessionAt: '',
      sessionTotal: 0,
      bazarList: [],
    });
  }

  return (
    <div className="min-h-full py-2">
      <div className="mb-3 space-y-2">
        <h1 className="text-2xl">Bazar List</h1>
        <input onChange={(e) => setSession((prev) => ({ ...prev, sessionTitle: e.target.value }))} value={session.sessionTitle} type="text" placeholder="Bazar title" className="w-full min-w-0 rounded-lg border-1 border-(--slick-border) bg-(--primary) py-1 text-center text-lg transition-colors duration-150 outline-none focus:border-(--input-focus-border)" />
      </div>

      <div className={`space-y-2 transition-[padding] duration-450 ${isCalcExpanded ? 'pb-80' : 'pb-20'}`}>
        <div className="rounded-lg border border-(--slick-border) bg-(--primary) p-2">
          <div className="space-y-2">
            <p>
              Total items: <span className="font-medium underline underline-offset-3">{items.length}</span>, Total price: <span className="font-medium underline underline-offset-3">{items.reduce((acc, eachItem) => eachItem.total + acc, 0)}</span> ৳
            </p>

            <div className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) pt-2">
              <AnimatePresence>
                {items.length < 1 && (
                  <motion.p
                    initial={{
                      height: 0,
                    }}
                    animate={{
                      height: '33px',
                    }}
                    exit={{
                      height: 0,
                    }}
                    transition={{
                      height: { duration: 0.35 },
                    }}
                    className="overflow-hidden text-center"
                  >
                    <span>Your items will appear here</span>
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div className="overflow-hidden">
                    <div className="flex border-b-1 border-(--each-list-item-divider-clr) pb-2 pl-6">
                      <span className="flex-3 text-center text-sm font-medium">Item</span>
                      <span className="flex-2 text-center text-sm font-medium">Price</span>
                      <span className="flex-2 text-center text-sm font-medium">Qty+Unit</span>
                      <span className="flex-2 text-center text-sm font-medium">Total</span>
                      <span className="flex-1 text-center text-sm font-medium">Del</span>
                    </div>

                    <div className="">
                      <AnimatePresence>
                        {items.map((eachItem, i) => (
                          <EachItem key={eachItem.id} props={{ eachItem, i, setItems }} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="flex justify-end gap-2 overflow-hidden">
                <button
                  onClick={() => {
                    setItems([]);
                  }}
                  className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-4 py-1 text-sm"
                >
                  Delete all
                </button>
                <button onClick={addBazarSession} className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-4 py-1 text-sm">
                  Save
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
