import { motion } from 'motion/react';
import { CloseSvg } from '../../assets/Svg';

function EachItem({ props }) {
  const { i, setBazarList } = props;
  const { id, itemName, price, unit, quantity, total } = props.eachItem;
  return (
    <motion.div
      initial={{
        x: '-100%',
        opacity: 0,
        maxHeight: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
        maxHeight: '100px',
      }}
      exit={{
        x: '100%',
        opacity: 0,
        maxHeight: 0,
      }}
      transition={{
        x: { duration: 0.3 },
        opacity: { duration: 0.3 },
        maxHeight: { duration: 0.3 },
      }}
      key={id}
      className="relative flex h-auto cursor-default"
    >
      <span className="absolute top-1/2 left-2 -translate-y-1/2 border-none text-sm">{i + 1}.</span>
      <span className="grid flex-3 place-items-center py-2 pl-6 text-sm font-medium break-all">
        <span className="line-clamp-3">{itemName || '...'}</span>
      </span>
      <span className="grid flex-2 place-items-center py-2 text-sm font-medium">{`${price} ৳`}</span>
      <span className="grid flex-2 place-items-center py-2 text-sm font-medium">{`${quantity} ${unit}`}</span>
      <span className="grid flex-2 place-items-center py-2 text-sm font-medium">{`${total} ৳`}</span>
      <button
        onClick={() => {
          setBazarList((prev) => prev.filter((item) => item.id !== id));
        }}
        className="grid flex-1 place-items-center bg-(--slick-border) py-2 text-sm font-medium"
      >
        <span className="grid place-items-center">
          <CloseSvg size="18" />
        </span>
      </button>
    </motion.div>
  );
}

export default EachItem;
