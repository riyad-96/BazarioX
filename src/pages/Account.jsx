import { useNavigate } from 'react-router-dom';
import { ArrowLeftSvg } from '../assets/Svg';
import { signOut } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import toast from 'react-hot-toast';
import { useUniContexts } from '../contexts/UniContexts';
import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { addDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

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
        id: Date.now(),
        url: selectedImg,
        isSelected: true,
      };
      await addDoc(imgCollection, imgObj);
      await batch.commit();

      setUserData((prev) => ({
        ...prev,
        pictures: [imgObj, ...prev.pictures.map((p) => ({ ...p, isSelected: false }))],
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
          <div className="aspect-3/2 overflow-hidden rounded-xl bg-zinc-200">
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
                userData.pictures.map((p) => {
                  const { id, isSelected, url } = p;

                  return (
                    <div key={id} className={`size-[50px] sm:size-[60px] overflow-hidden rounded-lg bg-zinc-200 ${isSelected && 'outline-2 outline-orange-400'}`}>
                      <img className="size-full object-cover object-center" src={url} alt={`${userData.username} profile photo`} />
                    </div>
                  );
                })}
              {userData.pictures.length !== 5 && (
                <>
                  <label className="grid size-[50px] sm:size-[60px] place-items-center rounded-lg bg-zinc-200" htmlFor="img-input">
                    <ImagePlus color="currentColor" />
                  </label>
                  <input ref={imgFileInput} onChange={handleImgSelection} className="hidden" id="img-input" type="file" accept="image/*" />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 grid divide-y divide-zinc-100 rounded-lg bg-(--primary) shadow">
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">
            <span>Username</span>
            <span className="font-light opacity-70">{userData.username || 'set user name'}</span>
          </button>
          <button className="flex gap-2 px-6 py-2.5 hover:bg-(--second-lvl-bg)">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={cancelImageSelection} className="fixed inset-0 z-20 grid place-items-center bg-black/30 p-3 overflow-y-auto">
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
    </div>
  );
}

export default Account;
