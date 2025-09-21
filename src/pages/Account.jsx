import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../assets/Svg';
import { signOut } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import toast from 'react-hot-toast';
import { useUniContexts } from '../contexts/UniContexts';
import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { addDoc, collection, doc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';

function Account() {
  const navigate = useNavigate();

  const { user, userData, setUserData, setAllMonthData, setCurrentSession, setClickDisabled } = useUniContexts();

  // profile image updation
  const [selectedImg, setSelectedImg] = useState('');
  const imgFileInput = useRef();

  async function handleImgSelection(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size >= 1024 * 650) {
      toast.error('Image file size must be under 650KB', { duration: 3000 });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64URL = reader.result;
      setSelectedImg(base64URL);
    };
    reader.readAsDataURL(file);
  }

  function cancelImageSelection() {
    setSelectedImg('');
    imgFileInput.current.value = '';
  }

  // image save function
  async function saveProfileImage() {
    setClickDisabled(true);
    try {
      const imgCollection = collection(db, 'users', user.uid, 'pictures');

      const snapshot = await getDocs(imgCollection);
      const batch = writeBatch(db);

      snapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { isSelected: false });
      });

      const imgObj = {
        addedAt: new Date(),
        url: selectedImg,
        isSelected: true,
      };
      const newImg = await addDoc(imgCollection, imgObj);
      await batch.commit();

      setUserData((prev) => ({
        ...prev,
        pictures: [{ ...imgObj, id: newImg.id }, ...prev.pictures.map((p) => ({ ...p, isSelected: false }))],
      }));

      cancelImageSelection();
    } catch (err) {
      console.error(err);
    } finally {
      setClickDisabled(false);
    }
  }

  function triggerImageSaving() {
    const savingPromise = saveProfileImage();
    toast.promise(
      savingPromise,
      {
        loading: 'Uploading your profile picture...',
        success: 'Profile picture updated',
        error: 'Failed to upload image',
      },
      { duration: 3500 },
    );
  }

  async function changePhoto(id) {
    const img = userData.pictures.find((p) => p.id === id);
    if (img.isSelected) return;

    try {
      const imgCollection = collection(db, 'users', user.uid, 'pictures');

      const snapshot = await getDocs(imgCollection);
      const batch = writeBatch(db);

      snapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { isSelected: docSnap.id === id });
      });
      await batch.commit();

      setUserData((prev) => ({
        ...prev,
        pictures: [...prev.pictures.map((p) => (p.id === id ? { ...p, isSelected: true } : { ...p, isSelected: false }))],
      }));
      toast.success('Selected new picture');
    } catch (err) {
      console.log(err);
    }
  }

  // change username and phone
  const [userName, setUserName] = useState('');

  async function changeUserName() {
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { username: userName });
      setUserData((prev) => ({ ...prev, username: userName }));
      setUserName('');
      toast.success('Username successfully changed');
    } catch (err) {
      console.error(err);
    }
  }
  const [phone, setPhone] = useState('');

  async function changePhone() {
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { phone });
      setUserData((prev) => ({ ...prev, phone }));
      setPhone('');
      toast.success('Phone successfully changed');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="scrollbar-thin grid h-dvh max-w-[700px] place-items-center overflow-y-auto bg-(--main-bg) p-3">
      <div className="absolute top-0 left-0 z-10 grid h-[60px] w-full content-center bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center gap-2 select-none">
          <button onClick={() => navigate(-1)} className="grid">
            <ArrowLeftSvg size="30" />
          </button>
          <span className="text-xl">Account</span>
        </div>
      </div>

      <div className="size-full pt-24">
        <div className="mb-5 space-y-4">
          <div className="aspect-3/2 overflow-hidden rounded-xl bg-zinc-200 shadow">
            <div className="size-full">
              {userData.pictures.length > 0 &&
                (() => {
                  const imgObj = userData.pictures.find((p) => p.isSelected);
                  if (imgObj) {
                    return <img className="size-full object-cover object-center" src={imgObj.url} alt={`${userData.username} profile photo`} />;
                  }
                })()}
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 pl-1">Profile picture</h4>
            <div className="flex gap-2 sm:gap-4">
              {userData.pictures.length > 0 &&
                userData.pictures.map((p) => (
                  <div onClick={() => changePhoto(p.id)} key={p.id} className={`size-[50px] overflow-hidden rounded-lg bg-zinc-200 shadow sm:size-[60px] ${p.isSelected && 'outline-2 outline-orange-400'}`}>
                    <img className="size-full object-cover object-center" src={p.url} alt={`${userData.username} profile photo`} />
                  </div>
                ))}

              {userData.pictures.length !== 5 && (
                <>
                  <label className="grid size-[50px] place-items-center rounded-lg bg-zinc-200 sm:size-[60px]" htmlFor="img-input">
                    <ImagePlus color="currentColor" />
                  </label>
                  <input ref={imgFileInput} onChange={handleImgSelection} className="hidden" id="img-input" type="file" accept="image/*" />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button onClick={() => setUserName(userData.username)} className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Username</span>
            <span className="font-light opacity-70">{userData.username || 'set user name'}</span>
          </button>
          <button onClick={() => setPhone(userData.phone)} className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Phone number</span>
            <span className="font-light opacity-70">{userData.phone || 'set number'}</span>
          </button>
          <button className="flex px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Change password</span>
          </button>
        </div>

        <div className="grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button
            onClick={async () => {
              try {
                await signOut(auth);
                toast.success('Logged out successfully!', { duration: 2500 });
                localStorage.clear();
                setAllMonthData([]);
                setCurrentSession({ sessionTitle: '', bazarList: [] });
                navigate(-2);
              } catch (err) {
                toast.error('Logout failed, please try again.', { duration: 2500 });
                console.error(err);
              }
            }}
            className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)"
          >
            Log out
          </button>
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">Delete account</button>
        </div>
      </div>

      {/* modals */}

      <AnimatePresence>
        {selectedImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={cancelImageSelection} className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-black/30 p-3">
            <motion.div
              initial={{ y: '50px' }}
              animate={{ y: 0 }}
              exit={{ y: '50px' }}
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userName && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setUserName('')} className="fixed inset-0 z-20 grid items-end justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
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
                <label htmlFor="phone">Username</label>
                <input
                  onKeyDownCapture={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      changeUserName();
                    }
                  }}
                  autoFocus
                  className="w-full min-w-0 rounded-full border border-transparent bg-(--primary) px-4 py-2 outline-none focus:border-(--input-focus-border)"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setUserName('')} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
                  Cancel
                </button>
                <button onClick={changeUserName} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setPhone('')} className="fixed inset-0 z-20 grid items-end justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
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
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setPhone('')} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
                  Cancel
                </button>
                <button onClick={changePhone} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;
