import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'motion/react';
import { useState } from 'react';
import { auth } from '../../configs/firebase';
import toast from 'react-hot-toast';
import { LoaderCircle, MailCheck } from 'lucide-react';

function ForgotPassModal({ state }) {
  const { loginEmail, setForgotPassModalShowing } = state;
  const [email, setEmail] = useState(loginEmail);
  const [emailErr, setEmailErr] = useState('');

  function ableToSend() {
    let ableToLogin = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setEmailErr('Email is required');
      ableToLogin = false;
      return;
    } else if (!emailRegex.test(email)) {
      setEmailErr('Insert a valid email');
      ableToLogin = false;
      return;
    } else {
      setEmailErr('');
    }

    return ableToLogin;
  }

  const [isSending, setIsSending] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  async function sendResetLink() {
    setEmailErr('');
    const isAbleToSend = ableToSend();
    if (!isAbleToSend) return;

    try {
      setIsSending(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset link sent');
      setResetLinkSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') setEmailErr("Couldn't find this email");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setForgotPassModalShowing(false)} className="fixed inset-0 z-20 grid place-items-center overflow-hidden bg-black/30 p-3 pb-6">
      <motion.div
        initial={{ y: '50px' }}
        animate={{ y: 0 }}
        exit={{ y: '50px', opacity: 0 }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-[450px] space-y-6 rounded-2xl bg-(--second-lvl-bg) p-4"
      >
        {resetLinkSent ? (
          <div>
            <h4 className="mb-4 text-xl">Reset password !</h4>
            <div className="grid gap-2">
              <MailCheck size="30" />
              <span className="text-sm">
                Reset link sent. check <strong>{email}</strong>'s inbox. If you don’t see it, check your <strong>Spam</strong> or <strong>Junk</strong> folder.
              </span>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="mb-4 text-xl">Reset password !</h4>
            <div className="mb-2 grid gap-1">
              <label htmlFor="newPass" className="pl-1">
                Enter your account email
              </label>
              <input
                onChange={(e) => {
                  setEmailErr('');
                  setEmail(e.target.value);
                }}
                value={email}
                type="text"
                id="newPass"
                className="w-full min-w-0 rounded-full border border-(--slick-border) bg-(--primary) px-4 py-2 transition-[border-color] duration-150 outline-none focus:border-(--input-focus-border)"
                placeholder="you@example.com"
                autoComplete="off"
              />
              <span className={`pl-2 text-sm text-red-500 transition-[height] duration-150 ${emailErr ? 'h-[20px]' : 'h-0'}`}>{emailErr}</span>
            </div>
            <p className="pl-1 text-sm opacity-80">
              We’ll send you a link to reset your password{' '}
              {email && (
                <span>
                  to <strong>{email}</strong>
                </span>
              )}
              . If you don’t see it, check your <strong>Spam</strong> or <strong>Junk</strong> folder.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!resetLinkSent ? (
            <>
              <button onClick={() => setForgotPassModalShowing(false)} className="flex-1 rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isSending) return;
                  sendResetLink();
                }}
                className="flex flex-1 items-center justify-center rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70"
              >
                {isSending ? <LoaderCircle size="20" className="animate-spin" /> : <span>Send link</span>}
              </button>
            </>
          ) : (
            <button onClick={() => setForgotPassModalShowing(false)} className="flex-1 rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
              Close
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ForgotPassModal;
