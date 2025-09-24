import { confirmPasswordReset } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { auth } from '../../configs/firebase';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

function PasswordResetModal() {
  const params = new URLSearchParams(window.location.search);
  const oobCode = params.get('oobCode');

  const [newPass, setNewPass] = useState('');
  const [newPassInputErr, setNewPassInputErr] = useState('');

  const checkbox = useRef();

  function isAbleToSendRequest() {
    let canSendRequest = true;
    setNewPassInputErr('');

    if (!newPass) {
      setNewPassInputErr('Provide a strong password');
      canSendRequest = false;
    } else if (newPass.length < 6) {
      setNewPassInputErr('Password should be at least 6 characters');
      canSendRequest = false;
    }

    if (!checkbox.current.checked && !newPassInputErr) {
      const label = checkbox.current.parentNode;

      label.classList.add('warning-effect');
      setTimeout(() => {
        label.classList.remove('warning-effect');
      }, 400);

      canSendRequest = false;
    }

    return canSendRequest;
  }

  const [tryingPasswordReset, setTryingPasswordReset] = useState('');
  const [passChanged, setPassChanged] = useState(false);

  async function resetPassword() {
    const canSendRequest = isAbleToSendRequest();

    if (!canSendRequest) return;
    try {
      setTryingPasswordReset(true);
      await confirmPasswordReset(auth, oobCode, newPass);
      toast.success('Password reset successful.', { duration: 3500 });
      setPassChanged(true);
    } catch (err) {
      toast.error('Password reset failed, try again.');
      console.error(err);
    } finally {
      setTryingPasswordReset(false);
    }
  }

  if (!oobCode) return <Navigate to="/auth/log-in" replace />;

  return (
    <div>
      <h1 className="mb-8 text-center text-2xl">Reset Password</h1>
      {passChanged ? (
        <div className="grid justify-items-center gap-4">
          <Check size="30" />
          <p>Reset succesful. Close this page.</p>
        </div>
      ) : (
        <>
          <div className="mb-2 grid gap-1">
            <label htmlFor="newPass" className="pl-1">
              Enter new password
            </label>
            <input
              onChange={(e) => {
                setNewPassInputErr('');
                setNewPass(e.target.value);
              }}
              value={newPass}
              type="text"
              id="newPass"
              className="w-full min-w-0 rounded-full border border-(--slick-border) bg-(--primary) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)"
              placeholder="Enter password"
              autoComplete="off"
            />
            <span className={`block overflow-hidden pl-1 text-sm font-light text-red-500 transition-[height] duration-150 ${newPassInputErr ? 'h-[20px]' : 'h-0'}`}>{newPassInputErr}</span>

            <label htmlFor="checkbox" className="flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-sm">
              <input type="checkbox" id="checkbox" ref={checkbox} />
              <span>I agree, this will reset my password.</span>
            </label>
          </div>

          <span className="block w-fit rounded-md bg-red-100 px-2 py-0.5 text-sm">For security, don’t reuse your previous password.</span>

          <div className="">
            <button
              onClick={() => {
                if (tryingPasswordReset) return;
                resetPassword();
              }}
              className={`relative my-2 grid h-[45px] w-full place-items-center rounded-lg border bg-zinc-800 text-white ${tryingPasswordReset && 'opacity-80'}`}
              type="button"
            >
              {tryingPasswordReset && (
                <span className="absolute top-1/2 left-1/2 flex -translate-1/2 gap-1">
                  <span className="size-[5px] animate-[ping_900ms_infinite] rounded-full bg-white"></span>
                  <span className="size-[5px] animate-[ping_900ms_100ms_infinite] rounded-full bg-white"></span>
                  <span className="size-[5px] animate-[ping_900ms_150ms_infinite] rounded-full bg-white"></span>
                  <span className="size-[5px] animate-[ping_900ms_200ms_infinite] rounded-full bg-white"></span>
                </span>
              )}
              {!tryingPasswordReset && <span className="absolute top-1/2 left-1/2 -translate-1/2">Confirm</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PasswordResetModal;
