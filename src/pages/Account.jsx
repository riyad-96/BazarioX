import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg, ProfilePlaceholderSvg } from '../assets/Svg';
import { signOut } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import toast from 'react-hot-toast';
import { useUniContexts } from '../contexts/UniContexts';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore';

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

  // delete profile picture
  const [profilePicId, setProfilePicId] = useState('');

  async function deleteProfileImage() {
    try {
      const imgDocRef = doc(db, 'users', user.uid, 'pictures', profilePicId);
      await deleteDoc(imgDocRef);

      const selectedImg = userData.pictures.find((p) => p.id === profilePicId);
      if (selectedImg.isSelected) {
        const imgCollectionRef = collection(db, 'users', user.uid, 'pictures');
        const q = query(imgCollectionRef, orderBy('addedAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const lastPicDoc = snapshot.docs[0];
          await updateDoc(doc(db, 'users', user.uid, 'pictures', lastPicDoc.id), { isSelected: true });
        }

        setUserData((prev) => {
          const remainning = prev.pictures.filter((p) => p.id !== profilePicId);

          if (remainning.length > 0) {
            remainning[0] = { ...remainning[0], isSelected: true };
          }

          return { ...prev, pictures: remainning };
        });
      } else {
        setUserData((prev) => ({ ...prev, pictures: prev.pictures.filter((p) => p.id !== profilePicId) }));
      }
      setProfilePicId('');
      toast.success('Picture deleted');
    } catch (err) {
      console.error(err);
    }
  }

  // change username and phone
  const [userNameEditing, setUserNameEditing] = useState(false);
  const [userName, setUserName] = useState('');

  async function changeUserName() {
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { username: userName });
      setUserData((prev) => ({ ...prev, username: userName }));
      setUserNameEditing(false);
      toast.success('Username successfully changed');
    } catch (err) {
      console.error(err);
    }
  }

  const [phoneEditing, setPhoneEditing] = useState(false);
  const [phone, setPhone] = useState('');

  async function changePhone() {
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { phone });
      setUserData((prev) => ({ ...prev, phone }));
      setPhoneEditing(false);
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
              {userData.pictures.length > 0 ? (
                (() => {
                  const imgObj = userData.pictures.find((p) => p.isSelected);
                  if (imgObj) {
                    return <img className="size-full object-cover object-center" src={imgObj.url} alt={`${userData.username} profile photo`} />;
                  }
                })()
              ) : (
                <div className="grid size-full place-items-center">
                  <ProfilePlaceholderSvg className="size-1/2 fill-zinc-800" />
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 pl-1">Profile picture</h4>
            <div className="flex gap-2.5 sm:gap-4">
              {userData.pictures.length > 0 &&
                userData.pictures.map((p) => (
                  <div key={p.id} className={`group relative size-[50px] rounded-lg bg-zinc-200 shadow outline-2 transition-[outline-color] duration-150 sm:size-[60px] pointer-fine:cursor-pointer ${p.isSelected ? 'outline-orange-400' : 'outline-transparent'}`}>
                    <div onClick={() => changePhoto(p.id)} className="size-full overflow-hidden rounded-lg">
                      <img className="size-full object-cover object-center" src={p.url} alt={`${userData.username} profile photo`} />
                    </div>
                    <button onClick={() => setProfilePicId(p.id)} className="absolute top-0 right-0 grid translate-x-1/3 -translate-y-1/3 place-items-center rounded-full p-0.5 text-white transition-opacity duration-150 group-hover:opacity-100 pointer-fine:bg-black/50 pointer-fine:opacity-0 pointer-fine:hover:bg-black">
                      <X strokeWidth={3} color="currentColor" size="14" />
                    </button>
                  </div>
                ))}

              {userData.pictures.length !== 5 && (
                <>
                  <label className="grid size-[50px] place-items-center rounded-lg bg-zinc-200 sm:size-[60px] pointer-fine:cursor-pointer" htmlFor="img-input">
                    <ImagePlus color="currentColor" />
                  </label>
                  <input ref={imgFileInput} onChange={handleImgSelection} className="hidden" id="img-input" type="file" accept="image/*" />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button
            onClick={() => {
              setUserName(userData.username);
              setUserNameEditing(true);
            }}
            className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)"
          >
            <span>Username</span>
            <span className="font-light opacity-70">{userData.username || 'set user name'}</span>
          </button>
          <button
            onClick={() => {
              setPhoneEditing(true);
              setPhone(userData.phone);
            }}
            className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)"
          >
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
        {userNameEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setUserNameEditing(false)} className="fixed inset-0 z-20 grid items-end justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
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
                <button onClick={() => setUserNameEditing(false)} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
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
        {phoneEditing && (
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profilePicId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setProfilePicId('')} className="fixed inset-0 z-20 grid items-end justify-items-center overflow-hidden bg-black/30 p-3 pb-6">
            <motion.div
              initial={{ y: '50px' }}
              animate={{ y: 0 }}
              exit={{ y: '50px' }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className="w-full max-w-[400px] space-y-6 rounded-2xl bg-(--second-lvl-bg) p-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg">Delete this photo?</h3>
                <div className="mx-auto size-[200px] overflow-hidden rounded-full">
                  <img className="size-full object-cover object-center" src={userData.pictures.find((p) => p.id === profilePicId)?.url} alt={`${userData.username} profile picture`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setProfilePicId('')} className="rounded-full bg-(--primary) py-3 text-sm shadow hover:bg-(--primary)/70">
                  Cancel
                </button>
                <button onClick={deleteProfileImage} className="rounded-full border-2 border-red-500 bg-(--primary) py-2.5 text-sm font-medium tracking-wide text-red-500 shadow hover:bg-(--primary)/70">
                  Delete
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
