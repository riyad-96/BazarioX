import { motion } from 'motion/react';

import React from 'react';

function PhoneEditingModal({ state, func }) {
  const { phone, setPhone, setPhoneEditing } = state;
  const { changePhone } = func;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setPhoneEditing(false)} className="fixed inset-0 z-20 grid items-end justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px' }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[600px] space-y-6 rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        <div className="grid w-full gap-2">
          <label htmlFor="phone">Phone number</label>
          <input
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                changePhone();
              }
            }}
            autoFocus
            className="w-full min-w-0 rounded-full border border-transparent bg-(--primary) px-4 py-2 outline-none focus:border-(--input-focus-border)"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setPhoneEditing(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>
          <button onClick={changePhone} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PhoneEditingModal;
