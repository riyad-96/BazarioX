import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorSvg, EyeClosedSvg, EyeOpenSvg } from '../../assets/Svg';
import { auth } from '../../configs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();

  const emailInput = useRef(null);
  const passInput = useRef(null);

  useEffect(() => {
    emailInput.current.focus();
  }, []);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isPassVisible, setIsPassVisible] = useState(false);

  const [emailError, setEmailError] = useState(null);
  const [passError, setPassError] = useState(null);

  const [loginError, setLoginError] = useState(null);
  const [isTrying, setIsTrying] = useState(false);

  //! input validator function
  function isAbleToLogin() {
    let ableToLogin = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    function checkEmail() {
      if (!loginEmail) {
        setEmailError('Email is required');
        ableToLogin = false;
        return;
      } else if (!emailRegex.test(loginEmail)) {
        setEmailError('Insert a valid email');
        ableToLogin = false;
        return;
      } else {
        setEmailError('');
      }
    }
    checkEmail();

    const minPassLength = 6;
    function checkPass() {
      if (!loginPass) {
        setPassError('Password is required');
        ableToLogin = false;
        return;
      } else if (loginPass.length < minPassLength) {
        setPassError(`Password must be minimum ${minPassLength} chars.`);
        ableToLogin = false;
        return;
      } else {
        setPassError('');
      }
    }
    checkPass();
    return ableToLogin;
  }

  //! Handle login
  async function handleLogin() {
    const addToLogin = isAbleToLogin();
    if (!addToLogin) return;
    setIsTrying(true);
    setLoginError(null);

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      setIsTrying(false);
      toast.success('Welcome back!', { duration: 3500 });
      navigate('/', { replace: true });
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setLoginError('Email or password is wrong');
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('Too many attempts, try again later');
      } else {
        setLoginError('Something went wrong. please try again');
      }
      setIsTrying(false);
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-center text-[1.725rem]">Welcome back</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <div className="grid gap-1">
          <div className="grid gap-1">
            <label htmlFor="login-mail">Email address</label>
            <input
              onChange={(e) => {
                if (emailError || loginError) {
                  setEmailError(null);
                  setLoginError(null);
                }
                setLoginEmail(e.target.value.trim());
              }}
              value={loginEmail}
              ref={emailInput}
              className="w-full min-w-0 rounded-lg border border-zinc-200 px-3 py-2 transition-[border-color] outline-none focus:border-zinc-600 dark:border-zinc-700 dark:focus:border-zinc-400"
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
                  if (passError || loginError) {
                    setPassError(null);
                    setLoginError(null);
                  }
                  setLoginPass(e.target.value);
                }}
                value={loginPass}
                ref={passInput}
                className="w-full min-w-0 rounded-lg border border-zinc-200 px-3 py-2 transition-[border-color] outline-none focus:border-zinc-600 dark:border-zinc-700 dark:focus:border-zinc-400"
                id="login-password"
                type={isPassVisible ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="off"
              />
              <AnimatePresence>
                {loginPass && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ scale: { type: 'spring', stiffness: 900, damping: 20 } }}
                    onClick={() => {
                      setIsPassVisible((prev) => !prev);
                      passInput.current.focus();
                    }}
                    className="absolute top-1/2 right-1.5 z-5 grid size-[35px] -translate-y-1/2 place-items-center"
                  >
                    {isPassVisible && <EyeOpenSvg size="20" className="fill-zinc-700 dark:fill-zinc-300" />}
                    {!isPassVisible && <EyeClosedSvg size="20" className="fill-zinc-700 dark:fill-zinc-300" />}
                  </motion.button>
                )}
              </AnimatePresence>
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
            handleLogin();
          }}
          className={`relative my-2 grid h-[45px] w-full place-items-center rounded-lg border bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black ${isTrying && 'opacity-80'}`}
          type="button"
        >
          {isTrying && (
            <span className="absolute top-1/2 left-1/2 flex -translate-1/2 gap-1">
              <span className="size-[5px] animate-[ping_900ms_infinite] rounded-full bg-white dark:bg-black"></span>
              <span className="size-[5px] animate-[ping_900ms_100ms_infinite] rounded-full bg-white dark:bg-black"></span>
              <span className="size-[5px] animate-[ping_900ms_150ms_infinite] rounded-full bg-white dark:bg-black"></span>
              <span className="size-[5px] animate-[ping_900ms_200ms_infinite] rounded-full bg-white dark:bg-black"></span>
            </span>
          )}
          {!isTrying && <span className="absolute top-1/2 left-1/2 -translate-1/2">Continue</span>}
        </button>
      </form>

      <p className={`overflow-hidden text-center text-red-500 transition-[height] duration-150 ${loginError ? 'h-[24px]' : 'h-0'}`}>{loginError}</p>

      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <button onClick={() => navigate('/auth/create-account', { replace: true })} className="text-blue-500 pointer-coarse:underline pointer-fine:hover:underline">
          Sign up
        </button>
      </p>
    </div>
  );
}

export default Login;
