import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorSvg, EyeClosedSvg, EyeOpenSvg } from '../../assets/Svg';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../configs/firebase';

function Signup() {
  const navigate = useNavigate();

  const emailInput = useRef(null);
  const passInput = useRef(null);

  useEffect(() => {
    emailInput.current.focus();
  }, []);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [isPassVisible, setIsPassVisible] = useState(false);

  const [emailError, setEmailError] = useState(null);
  const [passError, setPassError] = useState(null);

  const [signupError, setSignupError] = useState(null);
  const [isTrying, setIsTrying] = useState(false);

  //! input validator function
  function isAbleToSignup() {
    let ableToSignup = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    function checkEmail() {
      if (!signupEmail) {
        setEmailError('Email is required');
        ableToSignup = false;
        return;
      } else if (!emailRegex.test(signupEmail)) {
        setEmailError('Insert a valid email');
        ableToSignup = false;
        return;
      } else {
        setEmailError('');
      }
    }
    checkEmail();

    const minPassLength = 6;
    function checkPass() {
      if (!signupPass) {
        setPassError('Password is required');
        ableToSignup = false;
        return;
      } else if (signupPass.length < minPassLength) {
        setPassError(`Password must be minimum ${minPassLength} chars.`);
        ableToSignup = false;
        return;
      } else {
        setPassError('');
      }
    }
    checkPass();
    return ableToSignup;
  }

  //! Handle Signup
  async function handleSignup() {
    const addToLogin = isAbleToSignup();
    if (!addToLogin) return;
    setIsTrying(true);
    setSignupError(null);

    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPass);
      setIsTrying(false);
    } catch (err) {
      console.error(err.code);
      if (err.code === 'auth/email-already-in-use') {
        setSignupError('Email already in use.');
      } else {
        setSignupError('Something went wrong. please try again');
        console.log(err);
      }
      setIsTrying(false);
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-center text-[1.725rem]">Create an account</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <div className="grid gap-1">
          <div className="grid gap-1">
            <label htmlFor="login-mail">Email address</label>
            <input
              onChange={(e) => {
                if (emailError || signupError) {
                  setEmailError(null);
                  setSignupError(null);
                }
                setSignupEmail(e.target.value.trim());
              }}
              value={signupEmail}
              ref={emailInput}
              className="w-full min-w-0 rounded-lg border border-zinc-200 px-3 py-2 transition-[border-color] outline-none focus:border-zinc-600"
              id="login-mail"
              type="mail"
              placeholder="Email address"
              autoComplete="off"
            />
          </div>
          <p className={`flex items-center gap-1 overflow-hidden text-sm font-light text-red-500 transition-[height] duration-150 ${emailError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            {emailError}
          </p>
        </div>

        <div className="grid gap-1">
          <div className="grid gap-1">
            <label htmlFor="login-password">Password</label>
            <div className="relative">
              <input
                onChange={(e) => {
                  if (passError || signupError) {
                    setPassError(null);
                    setSignupError(null);
                  }
                  setSignupPass(e.target.value);
                }}
                value={signupPass}
                ref={passInput}
                className="w-full min-w-0 rounded-lg border border-zinc-200 px-3 py-2 transition-[border-color] outline-none focus:border-zinc-600"
                id="login-password"
                type={isPassVisible ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="off"
              />
              {signupPass && (
                <AnimatePresence>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 900, damping: 20 }}
                    onClick={() => {
                      setIsPassVisible((prev) => !prev);
                      passInput.current.focus();
                    }}
                    className="absolute top-1/2 right-1.5 z-5 grid size-[35px] -translate-y-1/2 place-items-center"
                  >
                    {isPassVisible && <EyeOpenSvg size="20" className="fill-zinc-700" />}
                    {!isPassVisible && <EyeClosedSvg size="20" className="fill-zinc-700" />}
                  </motion.button>
                </AnimatePresence>
              )}
            </div>
          </div>
          <p className={`flex items-center gap-1 overflow-hidden text-sm font-light text-red-500 transition-[height] duration-150 ${passError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            {passError}
          </p>
        </div>

        <button
          onClick={() => {
            if (isTrying) return;
            handleSignup();
          }}
          className={`my-2 grid h-[45px] w-full place-items-center rounded-lg border bg-zinc-800 text-white ${isTrying && 'opacity-80'}`}
          type="button"
        >
          {isTrying && (
            <span className="flex gap-1">
              <span className="size-[5px] animate-[ping_900ms_infinite] rounded-full bg-white"></span>
              <span className="size-[5px] animate-[ping_900ms_100ms_infinite] rounded-full bg-white"></span>
              <span className="size-[5px] animate-[ping_900ms_150ms_infinite] rounded-full bg-white"></span>
              <span className="size-[5px] animate-[ping_900ms_200ms_infinite] rounded-full bg-white"></span>
            </span>
          )}
          {!isTrying && (
            <AnimatePresence>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Continue
              </motion.span>
            </AnimatePresence>
          )}
        </button>
      </form>

      <p className={`overflow-hidden text-center text-red-500 transition-[height] duration-150 ${signupError ? 'h-[24px]' : 'h-0'}`}>{signupError}</p>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <button onClick={() => navigate('/auth/log-in', { replace: true })} className="text-blue-500 pointer-coarse:underline pointer-fine:hover:underline">
          Log in
        </button>
      </p>
    </div>
  );
}

export default Signup;
