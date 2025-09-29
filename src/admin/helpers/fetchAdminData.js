import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../configs/firebase';

export function listenRequestOrReport(collectionId, status, callback) {
  let q = status === 'all' ? query(collection(db, collectionId), orderBy('createdAt', 'desc')) : query(collection(db, collectionId), where('status', '==', status), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, async (data) => {
    const allData = await Promise.all(
      data.docs.map(async (res) => {
        const { uid } = res.data();
        const pictureSnap = await getDocs(query(collection(db, 'users', uid, 'pictures'), where('isSelected', '==', true)));
        const picture = pictureSnap.docs.length < 1 ? null : pictureSnap.docs[0].data().url;
        const username = (await getDoc(doc(db, 'users', uid))).data().username;
        const joinDate = (await getDoc(doc(db, 'users', uid))).data().joinDate?.toDate();

        return { docId: res.id, ...res.data(), createdAt: res.data().createdAt?.toDate(), picture, user: { username, joinDate } };
      }),
    );

    callback(allData);
  });

  return unsubscribe;
}

export async function updateFeatureOrReportStatus(collectionId, docId, status) {
  try {
    const docRef = doc(db, collectionId, docId);
    await setDoc(docRef, { status }, { merge: true });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to update status: ' + err.message);
  }
}
