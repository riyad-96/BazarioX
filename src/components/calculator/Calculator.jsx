import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpSvg, CloseSvg } from '../../assets/Svg';

function Calculator({ className }) {
  const [bazar, setBazar] = useState({
    bazarTitle: '',
    createdAt: '',
    bazarList: [],
  });

  const [items, setItems] = useState([]);

  const [item, setItem] = useState({
    id: '',
    itemName: '',
    price: '',
    unit: 'kg',
    quantity: '',
    total: '',
    addedAt: '',
  });

  function setItemState(itemName, value) {
    if (itemName === 'price' || itemName === 'quantity') {
      if (value.trim() === '') {
        setItem((prev) => ({ ...prev, [itemName]: '' }));
        return;
      }
      setItem((prev) => ({ ...prev, [itemName]: +value }));
      return;
    }
    setItem((prev) => ({ ...prev, [itemName]: value }));
  }

  // set total price
  useEffect(() => {
    const { price, quantity, unit } = item;

    if (typeof price === 'number' && typeof quantity === 'number') {
      if (unit === 'kg' || unit === 'piece') {
        const total = (price * quantity).toFixed(2);
        setItem((prev) => ({ ...prev, total: +total }));
      }
      if (unit === 'gram') {
        const total = ((price / 1000) * quantity).toFixed(2);
        setItem((prev) => ({ ...prev, total: +total }));
      }
    } else {
      setItem((prev) => ({ ...prev, ['total']: '' }));
    }
  }, [item.price, item.quantity, item.unit]);

  // add to bazar items
  function addToBazarItems() {
    if (!item.price || !item.quantity) {
      console.log('both price and quantity section should be filled with integar number');
      return;
    }
    const newItem = {
      ...item,
      id: Date.now(),
      addedAt: new Date(),
    };
    setItems((prev) => [...prev, newItem]);
    // setItem({
    //   id: '',
    //   itemName: '',
    //   price: '',
    //   unit: 'kg',
    //   quantity: '',
    //   total: '',
    //   addedAt: '',
    // });
  }

  // expand calculator
  const [isCalcExpanded, setIsCalcExpanded] = useState(true);

  return (
    <div className={`${className} min-h-full py-2`}>
      <div className="mb-3 space-y-2">
        <h1 className="text-2xl">Bazar List</h1>
        <input type="text" placeholder="Bazar title" className="w-full min-w-0 rounded-lg border-1 border-(--slick-border) bg-(--primary) py-1 text-center text-lg transition-colors duration-150 outline-none focus:border-(--input-focus-border)" />
      </div>

      <div className={`space-y-2 transition-[padding] duration-450 ${isCalcExpanded ? 'pb-80' : 'pb-20'}`}>
        <div className="rounded-lg border border-(--slick-border) bg-(--primary) p-2">
          <div className="space-y-2">
            <p>
              Total items: <span className="underline underline-offset-2">{items.length}</span>, Total price: <span className="underline underline-offset-2">{items.reduce((acc, eachItem) => eachItem.total + acc, 0)}</span> taka
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
                    <div className="flex border-b-1 border-(--each-list-item-divider-clr) pb-2">
                      <span className="flex-1 text-center text-sm font-medium">Item</span>
                      <span className="flex-1 text-center text-sm font-medium">Price</span>
                      <span className="flex-1 text-center text-sm font-medium">Qty+Unit</span>
                      <span className="flex-1 text-center text-sm font-medium">Total</span>
                      <span className="flex-1 text-center text-sm font-medium">Delete</span>
                    </div>

                    <div className="divide-y divide-(--slick-border)">
                      <AnimatePresence>
                        {items.map((eachItem) => {
                          const { id, itemName, price, unit, quantity, total } = eachItem;
                          return (
                            <motion.div
                              initial={{
                                height: 0,
                                x: '-100%',
                                opacity: 0,
                              }}
                              animate={{
                                height: '35px',
                                x: 0,
                                opacity: 1,
                              }}
                              exit={{
                                height: 0,
                                x: '100%',
                                opacity: 0,
                              }}
                              transition={{
                                x: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                              }}
                              key={id}
                              className="flex divide-x divide-(--each-list-item-divider-clr) overflow-hidden"
                            >
                              <span className="grid flex-1 place-items-center text-center text-sm font-medium">{itemName}</span>
                              <span className="grid flex-1 place-items-center text-center text-sm font-medium">{`${price} ৳`}</span>
                              <span className="grid flex-1 place-items-center text-center text-sm font-medium">{`${quantity} ${unit}`}</span>
                              <span className="grid flex-1 place-items-center text-center text-sm font-medium">{`${total} ৳`}</span>
                              <button
                                onClick={() => {
                                  setItems((prev) => prev.filter((item) => item.id !== id));
                                }}
                                className="grid flex-1 place-items-center bg-(--slick-border) text-center text-sm font-medium"
                              >
                                <span className="grid place-items-center">
                                  <CloseSvg size="18" />
                                </span>
                              </button>
                            </motion.div>
                          );
                        })}
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
                <button className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-4 py-1 text-sm">Save</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`fixed bottom-[70px] left-1/2 z-5 w-[calc(100%_-_1rem)] -translate-x-1/2 rounded-md border border-(--slick-border) bg-(--primary) p-3 transition-[translate] duration-450 ${isCalcExpanded ? 'translate-0' : 'translate-y-[105%]'}`}>
        <button onClick={() => setIsCalcExpanded((prev) => !prev)} className={`absolute right-2 grid size-[35px] translate-y-[-100%] place-items-center border-(--slick-border) bg-(--primary) transition-[top] duration-350 ${isCalcExpanded ? 'top-0 rounded-t-md border-t border-r border-l' : 'top-[-15px] rounded-md border'}`}>
          <ArrowUpSvg className={``} size="22" />
        </button>
        <form onSubmit={(e) => e.preventDefault()} className={`space-y-2 transition-[scale_opacity] duration-400 ${isCalcExpanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <div className="space-y-2">
            <div>
              <label htmlFor="itemName">Item</label>
              <input
                onChange={(e) => {
                  setItemState('itemName', e.target.value);
                }}
                value={item.itemName}
                autoComplete="off"
                type="text"
                id="item"
                name="item"
                placeholder="item name"
                className="w-full min-w-0 rounded-md border-1 border-(--slick-border) px-2 py-1 transition-colors duration-150 outline-none focus:border-(--input-focus-border)"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="price">Price</label>
                <input
                  onChange={(e) => {
                    setItemState('price', e.target.value);
                  }}
                  value={item.price}
                  autoComplete="off"
                  type="number"
                  id="price"
                  name="price"
                  placeholder="per Kg/Piece"
                  className="w-full min-w-0 rounded-md border-1 border-(--slick-border) px-2 py-1 transition-colors duration-150 outline-none focus:border-(--input-focus-border)"
                />
              </div>
              <div>
                <label htmlFor="quantity">{item.unit.slice(0, 1).toUpperCase() + item.unit.slice(1)}</label>
                <input
                  onChange={(e) => {
                    setItemState('quantity', e.target.value);
                  }}
                  value={item.quantity}
                  autoComplete="off"
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder={`${item.unit === 'gram' ? 'e.g. 250' : 'e.g. 2'}`}
                  className="w-full min-w-0 rounded-md border-1 border-(--slick-border) px-2 py-1 transition-colors duration-150 outline-none focus:border-(--input-focus-border)"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block">Unit</span>
            <div className="flex gap-2 text-sm">
              <div className="grid">
                <input onChange={(e) => setItemState('unit', e.target.value)} checked={item.unit === 'kg'} value="kg" type="radio" name="unit" id="kg" className="peer hidden" />
                <label htmlFor="kg" className="rounded-md border border-(--slick-border) px-2 py-1 peer-checked:border-(--radio-checked-border) peer-checked:bg-(--radio-checked-bg) pointer-fine:cursor-pointer">
                  Kg
                </label>
              </div>
              <div className="grid">
                <input onChange={(e) => setItemState('unit', e.target.value)} checked={item.unit === 'gram'} value="gram" type="radio" name="unit" id="gram" className="peer hidden" />
                <label htmlFor="gram" className="rounded-md border border-(--slick-border) px-2 py-1 peer-checked:border-(--radio-checked-border) peer-checked:bg-(--radio-checked-bg) pointer-fine:cursor-pointer">
                  Gram
                </label>
              </div>
              <div className="grid">
                <input onChange={(e) => setItemState('unit', e.target.value)} checked={item.unit === 'piece'} value="piece" type="radio" name="unit" id="piece" className="peer hidden" />
                <label htmlFor="piece" className="rounded-md border border-(--slick-border) px-2 py-1 peer-checked:border-(--radio-checked-border) peer-checked:bg-(--radio-checked-bg) pointer-fine:cursor-pointer">
                  Piece
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <span className="block">Total</span>
              <span className="block flex-1 rounded-md border-1 border-(--slick-border) px-2 py-1">
                <span className={`${item.total ? 'opacity-100' : 'opacity-50'} transition-opacity duration-100`}>{item.total ? item.total : 0} ৳</span>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setItem({
                    id: '',
                    itemName: '',
                    price: '',
                    unit: 'kg',
                    quantity: '',
                    total: '',
                    addedAt: '',
                  });
                }}
                className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-4 py-1 text-sm"
              >
                Clear fields
              </button>
              <button onClick={addToBazarItems} type="submit" className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-4 py-1 text-sm">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Calculator;
