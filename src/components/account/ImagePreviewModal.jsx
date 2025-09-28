import { motion } from 'motion/react';

function ImagePreviewModal({ state, func }) {
  const { selectedImg } = state;
  const { cancelImageSelection, triggerImageSaving } = func;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={cancelImageSelection} className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-black/30 p-3">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px', opacity: 0 }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[600px] space-y-4 rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        <div className="aspect-square overflow-hidden rounded-xl shadow">
          <img className="size-full object-cover object-center" src={selectedImg} alt="selected image" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={cancelImageSelection} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>
          <button onClick={triggerImageSaving} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ImagePreviewModal;
