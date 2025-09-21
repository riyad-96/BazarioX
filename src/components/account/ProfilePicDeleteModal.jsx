import { motion } from 'motion/react';

function ProfilePicDeleteModal({ state, func }) {
  const { userData, profilePicId, setProfilePicId } = state;
  const { deleteProfileImage } = func;

  return (
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
  );
}

export default ProfilePicDeleteModal;
