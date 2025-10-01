import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useUniContexts } from '../../contexts/UniContexts';
import { deleteAccountAndAllData } from '../helpers/functions';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';

function AccountDelete({ state }) {
  const { setAccountDeleting } = state;
  const { user, setCurrentSession, setAllMonthData } = useUniContexts();

  // set time out logout
  const [reverseCount, setReverseCount] = useState(10);
  const timeout = useRef();

  useEffect(() => {
    timeout.current = setInterval(() => {
      if (reverseCount === 0) return;
      setReverseCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timeout.current);
  }, [reverseCount]);

  //! delete tools
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const passInput = useRef();
  const checkbox = useRef();

  // Delete account and data
  async function deleteAccount() {
    try {
      await deleteAccountAndAllData(user);
    } catch (err) {
      console.error(err);
    }
  }

  // check password
  async function checkCredential() {
    setCheckingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      passInput.current.setAttribute('readonly', true);
      setVerified(true);
    } catch (err) {
      if (err.code === 'auth/invalid-credential') setPasswordErr('Wrong password, please try again');
      if (err.code === 'auth/too-many-requests') setPasswordErr('Too many requests, try again later');
      console.error(err);
    } finally {
      setCheckingPassword(false);
    }
  }

  // verify password
  async function verifyPassword() {
    if (!password.trim()) {
      setPasswordErr('Please fill your current password');
      return;
    } else if (password.length < 6) {
      setPasswordErr('Password must be 6 character long');
      return;
    }
    setPasswordErr('');
    await checkCredential();
  }

  // trigger the delete
  function triggerDeleteAcount() {
    if (reverseCount > 0) return;

    if (!verified) {
      toast.error('Please verify password first to continue');
      return;
    }

    if (!checkbox.current.checked) {
      toast.error('Confirm deletion by checking the box');
      return;
    }

    const deleteAccountPromise = deleteAccount();
    toast.promise(
      deleteAccountPromise,
      {
        loading: 'Deleting your account…',
        success: () => {
          setAllMonthData([]);
          setCurrentSession({ sessionTitle: '', bazarList: [] });
          localStorage.clear();

          return 'Your account and all related data have been permanently deleted.';
        },
        error: 'Failed to delete account. Please try again.',
      },
      {
        duration: 3500,
      },
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setAccountDeleting(false)} className="fixed inset-0 z-20 grid place-items-center overflow-hidden bg-black/30 p-3 pb-6">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px', opacity: 0 }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[500px] space-y-4 rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        <h2 className="text-2xl font-medium">
          Delete Account <span className="text-red-500">!</span>
        </h2>
        <div className="space-y-4">
          <p className="rounded-md bg-red-200 px-3 py-2">⚠️ Warning: Deleting your account is permanent. All your data will be erased. This cannot be undone. </p>

          <div className="space-y-2">
            <div>
              <div className="grid gap-2">
                <label htmlFor="password" className="pl-1">
                  Confirm password
                </label>
                <input
                  ref={passInput}
                  onChange={(e) => {
                    setPasswordErr('');
                    setPassword(e.target.value);
                  }}
                  value={password}
                  id="password"
                  type="text"
                  className="rounded-full border border-(--slick-border) bg-(--primary) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)"
                  placeholder="Type your current password"
                  autoComplete="off"
                />
              </div>
              <span className={`block pl-2 text-sm text-red-500 transition-[height] duration-150 ${passwordErr ? 'h-[20px]' : 'h-0'}`}>{passwordErr}</span>
            </div>

            {verified ? (
              <motion.span
                initial={{
                  backgroundColor: '#ffffff',
                  width: '135px',
                }}
                animate={{
                  backgroundColor: '#5ee9b5',
                  width: '85px',
                }}
                className="grid h-[33px] place-items-center rounded-full bg-emerald-300 text-sm select-none"
              >
                Verified
              </motion.span>
            ) : (
              <button
                onClick={async () => {
                  if (checkingPassword) return;
                  verifyPassword();
                }}
                className="grid h-[33px] w-[135px] place-items-center rounded-full bg-(--primary) text-sm shadow-xs"
              >
                {checkingPassword ? (
                  <span className="animate-spin opacity-80">
                    <LoaderCircle size="20" />
                  </span>
                ) : (
                  <span>Verify password</span>
                )}
              </button>
            )}
          </div>

          <label htmlFor="checkbox-1" className="flex items-center gap-2 text-sm leading-4">
            <span className="grid">
              <input ref={checkbox} type="checkbox" id="checkbox-1" />
            </span>
            <span>I understand and want to permanently delete my account and all data.</span>
          </label>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button onClick={() => setAccountDeleting(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>

          <button onClick={triggerDeleteAcount} className={`flex justify-center gap-1.5 rounded-full border-2 border-red-500 bg-(--primary) py-3 text-sm text-red-500 shadow hover:bg-(--primary)/70 ${reverseCount > 0 && '!cursor-not-allowed opacity-50'}`}>
            <span>Delete Account</span>
            {reverseCount !== 0 && (
              <span className="flex">
                <span>(</span>
                <span className="w-4">{reverseCount}</span>
                <span>)</span>
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AccountDelete;
