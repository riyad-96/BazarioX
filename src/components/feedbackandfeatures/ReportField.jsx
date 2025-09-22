import { motion } from 'motion/react';
import { useUniContexts } from '../../contexts/UniContexts';

function ReportField() {
  const { user, userData, setUserData } = useUniContexts();

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h3 className="mb-2 flex gap-2 pl-1 text-2xl">
        <span>Report a bug</span>
      </h3>
      <label htmlFor="feature" className="mb-2 flex items-center gap-2 pl-1">
        <span>Tell us if something isn’t working properly</span>
      </label>
      <textarea id="feature" className="min-h-[100px] w-full min-w-0 resize-y rounded-lg border border-transparent bg-(--textarea-bg) p-3 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)" placeholder="Enter your message"></textarea>

      <button className="w-full rounded-lg bg-red-200 py-2 shadow">Send</button>
    </motion.div>
  );
}

export default ReportField;
