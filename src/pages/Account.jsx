import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeftSvg, ProfilePlaceholderSvg } from '../assets/Svg';
import { signOut } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import toast from 'react-hot-toast';
import { useUniContexts } from '../contexts/UniContexts';
import { Home, ImagePlus, LoaderCircle, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import ImagePreviewModal from '../components/account/ImagePreviewModal';
import NameEditingModal from '../components/account/NameEditingModal';
import PhoneEditingModal from '../components/account/PhoneEditingModal';
import ProfilePicDeleteModal from '../components/account/ProfilePicDeleteModal';
import LogoutModal from '../components/account/LogoutModal';
import PasswordChangeModal from '../components/account/PasswordChangeModal';

function Account() {
  const navigate = useNavigate();

  const { user, userData, userDataLoading, setUserData, setAllMonthData, setCurrentSession, setClickDisabled } = useUniContexts();

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
        addedAt: serverTimestamp(),
        url: selectedImg,
        isSelected: true,
      };
      const newImg = await addDoc(imgCollection, imgObj);
      await batch.commit();

      setUserData((prev) => ({
        ...prev,
        pictures: [{ ...imgObj, id: newImg.id, addedAt: new Date() }, ...prev.pictures.map((p) => ({ ...p, isSelected: false }))],
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
      console.error(err);
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
      await setDoc(docRef, { username: userName }, { merge: true });
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
      await setDoc(docRef, { phone }, { merge: true });
      setUserData((prev) => ({ ...prev, phone }));
      setPhoneEditing(false);
      toast.success('Phone successfully changed');
    } catch (err) {
      console.error(err);
    }
  }

  // logout
  const [requestingLogout, setRequestingLogout] = useState(false);

  // change password
  const [changingPassword, setChangingPassword] = useState(false);
  async function sendPasswordChangeRequest(newPass) {
    console.log(newPass);
  }

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-(--main-bg)">
      <div className="flex h-[60px] bg-(--main-bg) px-3">
        <div className="mx-auto flex w-full max-w-[700px] items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="grid">
              <ArrowLeftSvg size="30" />
            </button>
            <span className="text-xl">Account</span>
          </div>

          <button onClick={() => navigate('/')} className="rounded-lg p-2 shadow max-sm:p-1.5">
            <Home size="20" />
          </button>
        </div>
      </div>

      <div className="scrollbar-thin size-full overflow-y-auto px-3 pt-20 pb-8">
        <div className="mx-auto max-w-[700px]">
          <div className="mb-5 space-y-4">
            <div className="relative mx-auto mb-8 aspect-1/1 max-w-[400px] rounded-xl bg-zinc-200 shadow">
              {userDataLoading ? (
                <span className="block size-full animate-pulse rounded-xl bg-zinc-300"></span>
              ) : (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="relative z-2 size-full overflow-hidden rounded-2xl">
                    {userData.pictures.length > 0 ? (
                      (() => {
                        const imgObj = userData.pictures.find((p) => p.isSelected);
                        if (imgObj) {
                          return <img className="size-full object-cover object-center" src={imgObj.url} alt={`${userData.username} profile photo`} />;
                        }
                      })()
                    ) : (
                      <span className="grid size-full place-items-center">
                        <ProfilePlaceholderSvg className="size-1/2 fill-zinc-800" />
                      </span>
                    )}
                  </motion.div>

                  {userData.pictures.length > 0 && (
                    <div className="absolute inset-0 z-1 animate-[blur-effect_5s_ease-in-out_infinite]">
                      <img className="size-full rounded-2xl object-cover object-center" src={userData.pictures.find((p) => p.isSelected).url} alt={`${userData.username} profile photo`} />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-12">
              <h4 className="mb-2 flex items-center gap-2 pl-1">Profile picture{userData.pictures.length > 1 && 's'}</h4>
              <div className="flex gap-2.5 sm:gap-4">
                {userData.pictures.length > 0 &&
                  userData.pictures.map((p, i) => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} key={p.id} className={`group relative size-[50px] rounded-lg bg-zinc-200 shadow outline-2 transition-[outline-color] duration-150 sm:size-[60px] pointer-fine:cursor-pointer ${p.isSelected ? 'outline-orange-400' : 'outline-transparent'}`}>
                      <div onClick={() => changePhoto(p.id)} className="size-full overflow-hidden rounded-lg">
                        <img className="size-full object-cover object-center" src={p.url} alt={`${userData.username} profile photo`} />
                      </div>
                      <button onClick={() => setProfilePicId(p.id)} className="absolute top-0 right-0 grid translate-x-1/3 -translate-y-1/3 place-items-center rounded-full bg-black/70 p-0.5 text-white transition-opacity duration-150 group-hover:opacity-100 pointer-fine:bg-black/50 pointer-fine:opacity-0 pointer-fine:hover:bg-black">
                        <X strokeWidth={3} color="currentColor" size="14" />
                      </button>
                    </motion.div>
                  ))}

                {userData.pictures.length !== 5 && (
                  <>
                    <label className="grid size-[50px] place-items-center rounded-lg bg-zinc-200 sm:size-[60px] pointer-fine:cursor-pointer" htmlFor="img-input">
                      {userDataLoading ? (
                        <span className="animate-spin">
                          <LoaderCircle />
                        </span>
                      ) : (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <ImagePlus color="currentColor" />
                        </motion.span>
                      )}
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
              className="flex gap-2 px-6 py-2.5 pointer-fine:hover:bg-(--second-lvl-bg)"
            >
              <span>Username</span>
              <span className="font-light opacity-70">{userDataLoading ? '...' : <>{userData.username || 'set user name'} </>}</span>
            </button>
            <button
              onClick={() => {
                setPhoneEditing(true);
                setPhone(userData.phone);
              }}
              className="flex gap-2 px-6 py-2.5 pointer-fine:hover:bg-(--second-lvl-bg)"
            >
              <span>Phone number</span>
              <span className="font-light opacity-70">{userDataLoading ? '...' : <>{userData.phone || 'set number'} </>}</span>
            </button>
            <button onClick={() => setChangingPassword(true)} className="flex px-6 py-2.5 pointer-fine:hover:bg-(--second-lvl-bg)">
              <span>Change password</span>
            </button>
          </div>

          <div className="grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
            <button onClick={() => setRequestingLogout(true)} className="flex gap-2 px-6 py-2.5 pointer-fine:hover:bg-(--second-lvl-bg)">
              Log out
            </button>
            <button className="flex gap-2 px-6 py-2.5 pointer-fine:hover:bg-(--second-lvl-bg)">Delete account</button>
          </div>
        </div>
      </div>

      {/* modals */}
      <AnimatePresence>{selectedImg && <ImagePreviewModal state={{ selectedImg }} func={{ cancelImageSelection, triggerImageSaving }} />}</AnimatePresence>

      <AnimatePresence>{userNameEditing && <NameEditingModal state={{ userName, setUserNameEditing, setUserName }} func={{ changeUserName }} />}</AnimatePresence>

      <AnimatePresence>{phoneEditing && <PhoneEditingModal state={{ phone, setPhone, setPhoneEditing }} func={{ changePhone }} />}</AnimatePresence>

      <AnimatePresence>{profilePicId && <ProfilePicDeleteModal state={{ userData, profilePicId, setProfilePicId }} func={{ deleteProfileImage }} />}</AnimatePresence>

      <AnimatePresence>{requestingLogout && <LogoutModal state={{ setRequestingLogout }} />}</AnimatePresence>

      <AnimatePresence>{changingPassword && <PasswordChangeModal state={{ setChangingPassword }} func={{ sendPasswordChangeRequest }} />}</AnimatePresence>
    </div>
  );
}

export default Account;
