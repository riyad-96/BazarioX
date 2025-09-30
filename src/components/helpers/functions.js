import { collection, doc } from 'firebase/firestore';
import { db } from '../../configs/firebase';

export async function deleteAccountAndAllData(user) {
  const docRefs = [
    {
      ref: collection(db, 'users', user.uid, 'bazarSessions'),
      type: 'collection',
      nested: true,
    },
    {
      ref: collection(db, 'users', user.uid, 'pictures'),
      type: 'collection',
      nested: true,
    },
    {
      ref: collection(db, 'features'),
      type: 'collection',
      nested: false,
    },
    {
      ref: collection(db, 'reports'),
      type: 'collection',
      nested: false,
    },
    {
      ref: doc(db, 'users', user.uid),
      type: 'doc',
      nested: false,
    },
    {
      ref: doc(db, 'feedbacks', user.uid),
      type: 'doc',
      nested: false,
    },
  ];
}
