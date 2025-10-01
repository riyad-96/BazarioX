import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useUniContexts } from '../../contexts/UniContexts';
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import { Loader, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function PasswordChangeModal({ state }) {
  const { setChangingPassword } = state;

  const { user } = useUniContexts();

  const [passObj, setPassObj] = useState({
    currentPass: '',
    newPass: '',
  });
  const [currentPassInputErr, setCurrentPassInputErr] = useState('');
  const [newPassInputErr, setNewPassInputErr] = useState('');
  const [tryingPasswordChange, setTryingPasswordChange] = useState(false);
  const [uniError, setUniError] = useState('');
  const checkbox = useRef();
  const timeout = useRef();

  function isAbleToSendRequest() {
    setCurrentPassInputErr('');
    setNewPassInputErr('');
    setUniError('');

    let canSendRequest = true;
    const currPass = passObj.currentPass.trim();
    const newPass = passObj.newPass.trim();

    if (!currPass) {
      setCurrentPassInputErr('Enter your current password');
      canSendRequest = false;
    } else if (currPass.length < 6) {
      setCurrentPassInputErr('Password should be at least 6 characters');
      canSendRequest = false;
    }

    if (!newPass) {
      setNewPassInputErr('Enter a new password');
      canSendRequest = false;
    } else if (newPass.length < 6) {
      setNewPassInputErr('Password should be at least 6 characters');
      canSendRequest = false;
    }

    if (!checkbox.current.checked) {
      checkbox.current.parentNode.classList.add('warning-effect');
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        checkbox.current.parentNode.classList.remove('warning-effect');
      }, 400);
      canSendRequest = false;
    }

    if (currPass && newPass && currPass === newPass && checkbox.current.checked) {
      setUniError('New password must be different');
      canSendRequest = false;
    }

    return canSendRequest;
  }

  async function changePassword() {
    setUniError('');
    const canSendRequest = isAbleToSendRequest();

    if (!canSendRequest) return;

    try {
      setTryingPasswordChange(true);
      const credential = EmailAuthProvider.credential(user.email, passObj.currentPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passObj.newPass);
      toast.success('Password successfully updated', { duration: 2500 });
      setChangingPassword(false);
    } catch (err) {
      if (err.code === 'auth/invalid-credential') setCurrentPassInputErr('Wrong password, please try again');
      if (err.code === 'auth/too-many-requests') setUniError('Too many requests, try again later');
      console.error(err);
    } finally {
      setTryingPasswordChange(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setChangingPassword(false)} className="fixed inset-0 z-20 grid place-items-center overflow-hidden bg-black/30 p-3 pb-6">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px', opacity: 0 }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[450px] space-y-4 rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        <div className="space-y-">
          <div className="grid gap-1">
            <label htmlFor="currentPass" className="pl-1">
              Current password
            </label>
            <input
              onChange={(e) => {
                setPassObj((prev) => ({ ...prev, currentPass: e.target.value }));
                setCurrentPassInputErr('');
                setUniError('');
              }}
              value={passObj.currentPass}
              type="text"
              id="currentPass"
              className="w-full min-w-0 rounded-full border border-(--slick-border) bg-(--primary) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)"
              placeholder="Current password"
              autoComplete="off"
            />
            <span className={`block overflow-hidden pl-2 text-sm font-light text-red-500 transition-[height] duration-150 ${currentPassInputErr ? 'h-[20px]' : 'h-0'}`}>{currentPassInputErr}</span>
          </div>
          <div className="grid gap-1">
            <label htmlFor="newPass" className="pl-1">
              New password
            </label>
            <input
              onChange={(e) => {
                setPassObj((prev) => ({ ...prev, newPass: e.target.value }));
                setNewPassInputErr('');
                setUniError('');
              }}
              value={passObj.newPass}
              type="text"
              id="newPass"
              className="w-full min-w-0 rounded-full border border-(--slick-border) bg-(--primary) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)"
              placeholder="New password"
              autoComplete="off"
            />
            <span className={`block overflow-hidden pl-2 text-sm font-light text-red-500 transition-[height] duration-150 ${newPassInputErr ? 'h-[20px]' : 'h-0'}`}>{newPassInputErr}</span>
          </div>

          <span className={`block overflow-hidden pl-2 text-center text-sm font-light text-red-500 transition-[height] duration-150 ${uniError ? 'h-[20px]' : 'h-0'}`}>{uniError}</span>

          <div>
            <label htmlFor="checkbox" className="flex w-fit items-center gap-2 rounded-md px-2 py-0.5 text-sm">
              <input ref={checkbox} type="checkbox" id="checkbox" />
              <span>I understand, my password will be updated.</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setChangingPassword(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
            Cancel
          </button>
          <button
            onClick={() => {
              if (tryingPasswordChange) return;
              changePassword();
            }}
            className={`grid place-items-center rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70 ${tryingPasswordChange && '!cursor-not-allowed'}`}
          >
            {tryingPasswordChange ? <LoaderCircle size="20" className="animate-spin" /> : <span>Change</span>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PasswordChangeModal;
