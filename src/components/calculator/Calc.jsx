import { useEffect } from 'react';
import { ArrowUpSvg } from '../../assets/Svg';
import { useUniContexts } from '../../contexts/UniContexts';

function Calc({ props }) {
  const { isCalcExpanded, setIsCalcExpanded, item, setItem } = props;
  const { setCurrentSession } = useUniContexts();

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
      return;
    }
    const newItem = {
      ...item,
      id: Date.now(),
      addedAt: new Date(),
    };
    setCurrentSession((prev) => ({ ...prev, bazarList: [...prev.bazarList, newItem] }));
    setItem({
      id: '',
      itemName: '',
      price: '',
      unit: 'kg',
      quantity: '',
      total: '',
      addedAt: '',
    });
  }

  return (
    <div className={`absolute bottom-[70px] left-1/2 z-5 w-[calc(100%_-_1rem)] -translate-x-1/2 rounded-md border border-(--slick-border) bg-(--primary) p-3 transition-[translate] duration-450 ${isCalcExpanded ? 'translate-0' : 'translate-y-[105%]'}`}>
      <button onClick={() => setIsCalcExpanded((prev) => !prev)} className={`absolute right-2 grid size-[35px] translate-y-[-100%] place-items-center border-(--slick-border) bg-(--primary) transition-[top] duration-350 ${isCalcExpanded ? 'top-0 rounded-t-md border-t border-r border-l' : 'top-[-15px] rounded-md border'}`}>
        <ArrowUpSvg className={`transition-[rotate] duration-450 ${isCalcExpanded ? 'rotate-[180deg]' : 'rotate-0'}`} size="22" />
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
              placeholder="Item name"
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
                placeholder="Per Kg/Piece"
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
                placeholder={`${item.unit === 'gram' ? 'E.g. 250' : 'E.g. 2'}`}
                className="w-full min-w-0 rounded-md border-1 border-(--slick-border) px-2 py-1 transition-colors duration-150 outline-none focus:border-(--input-focus-border)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="block">Unit</span>
          <div className="flex gap-2 text-sm">
            <button onClick={() => setItemState('unit', 'kg')} className={`rounded-md border border-(--slick-border) px-2 py-1 pointer-fine:cursor-pointer ${item.unit === 'kg' && 'border-(--unit-checked-border) bg-(--unit-checked-bg)'}`}>
              Kg
            </button>
            <button onClick={() => setItemState('unit', 'gram')} className={`rounded-md border border-(--slick-border) px-2 py-1 pointer-fine:cursor-pointer ${item.unit === 'gram' && 'border-(--unit-checked-border) bg-(--unit-checked-bg)'}`}>
              Gram
            </button>
            <button onClick={() => setItemState('unit', 'piece')} className={`rounded-md border border-(--slick-border) px-2 py-1 pointer-fine:cursor-pointer ${item.unit === 'piece' && 'border-(--unit-checked-border) bg-(--unit-checked-bg)'}`}>
              Piece
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <span className="block">Total</span>
            <span className="block flex-1 rounded-md border-1 border-(--slick-border) px-2 py-0.5">
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
              className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-3 py-0.5 text-sm"
            >
              Clear fields
            </button>
            <button onClick={addToBazarItems} type="submit" className="rounded-md border border-(--slick-border) bg-(--second-lvl-bg) px-3 py-0.5 text-sm">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Calc;
