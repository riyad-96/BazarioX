import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../configs/firebase';

export async function fetchRequestOrReport(collectionId, status) {
  let data = null;
  if (status === 'all') {
    try {
      const allRequestsUserSnap = await getDocs(query(collection(db, collectionId), orderBy('createdAt', 'desc')));
      data = await Promise.all(
        allRequestsUserSnap.docs.map(async (res) => {
          const { uid } = res.data();
          const pictureSnap = await getDocs(query(collection(db, 'users', uid, 'pictures'), where('isSelected', '==', true)));
          const picture = pictureSnap.docs.length < 1 ? null : pictureSnap.docs[0].data().url;
          const username = (await getDoc(doc(db, 'users', uid))).data().username;
          const joinDate = (await getDoc(doc(db, 'users', uid))).data().joinDate?.toDate();

          return { ...res.data(), createdAt: res.data().createdAt?.toDate(), picture, user: { username, joinDate } };
        }),
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      const allRequestsUserSnap = await getDocs(query(collection(db, collectionId), where('status', '==', status), orderBy('createdAt', 'desc')));
      data = await Promise.all(
        allRequestsUserSnap.docs.map(async (res) => {
          const { uid } = res.data();
          const pictureSnap = await getDocs(query(collection(db, 'users', uid, 'pictures'), where('isSelected', '==', true)));
          const picture = pictureSnap.docs.length < 1 ? null : pictureSnap.docs[0].data().url;
          const username = (await getDoc(doc(db, 'users', uid))).data().username;

          return { ...res.data(), createdAt: res.data().createdAt?.toDate(), picture, username };
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }

  return data;
}
