import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { deleteUser } from 'firebase/auth';

export async function deleteAccountAndAllData(user) {
  try {
    const docRefs = [
      { ref: collection(db, 'users', user.uid, 'bazarSessions'), type: 'collection', nested: true },
      { ref: collection(db, 'users', user.uid, 'pictures'), type: 'collection', nested: true },
      { ref: collection(db, 'features'), type: 'collection', nested: false },
      { ref: collection(db, 'reports'), type: 'collection', nested: false },
      { ref: doc(db, 'users', user.uid), type: 'doc', nested: false },
      { ref: doc(db, 'feedbacks', user.uid), type: 'doc', nested: false },
    ];

    const promises = [];

    for (const obj of docRefs) {
      if (obj.type === 'collection' && obj.nested) {
        const docs = await getDocs(obj.ref);
        docs.forEach((res) => {
          promises.push(deleteDoc(res.ref));
        });
      }
      if (obj.type === 'collection' && !obj.nested) {
        const docs = await getDocs(query(obj.ref, where('uid', '==', user.uid)));
        docs.forEach((res) => {
          promises.push(deleteDoc(res.ref));
        });
      }
      if (obj.type === 'doc') {
        const doc = await getDoc(obj.ref);
        if (doc.exists()) {
          promises.push(deleteDoc(doc.ref));
        }
      }
    }

    await Promise.all(promises);
    await deleteUser(user);
  } catch (err) {
    console.error(err);
  }
}

function filterFromLocalSessions(ids) {
  let sessions = JSON.parse(localStorage.getItem('localSessions'));
  if (sessions) {
    ids.forEach((id) => {
      sessions = sessions.filter((eachSession) => eachSession.id !== id);
    });
  }
  console.log(sessions);
}

export async function requestSessionDelete(user, ids) {
  // if (!user) {
  //   filterFromLocalSessions(ids);
  //   return 'local delete';
  // }
  filterFromLocalSessions(ids);

  // if (user && !navigator.onLine) {
  //   throw new Error('offline');
  // }

  // try {
  //   const promises = [];
  //   for (const id of ids) {
  //     const doc = await getDoc(doc(db, 'users', user.uid, 'bazarSessions', id));
  //     promises.push(deleteDoc(doc.ref));
  //   }
  //   await Promise.all(promises);
  // } catch (err) {
  //   console.error(err);
  //   throw new Error(err);
  // }
}
