import { motion } from 'motion/react';

function FeatureField() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h3 className="mb-2 flex gap-2 pl-1 text-2xl">
        <span>Request a Feature</span>
      </h3>
      <label htmlFor="feature" className="mb-2 flex items-center gap-2 pl-1">
        <span>Share any ideas or improvements </span>
      </label>
      <textarea id="feature" className="min-h-[180px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) p-3 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Enter your message"></textarea>

      <button className="w-full rounded-lg bg-blue-200 py-2 shadow">Send</button>
    </motion.div>
  );
}

export default FeatureField;
