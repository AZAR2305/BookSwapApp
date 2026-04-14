import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDbOrThrow } from '@/src/config/firebase';
import type { BookListing, UserProfile } from '@/src/utils/types';

export const subscribeToAllUsers = (callback: (users: UserProfile[]) => void) => {
  const db = getDbOrThrow();
  const q = query(collection(db, 'users'));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((d) => d.data() as UserProfile)
          .sort((left, right) => left.displayName.localeCompare(right.displayName))
      );
    },
    (error) => {
      console.warn('Admin users listener failed:', error);
      callback([]);
    }
  );
};

export const subscribeToReportedBooks = (callback: (books: BookListing[]) => void) => {
  const db = getDbOrThrow();
  const q = query(collection(db, 'books'), where('reported', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<BookListing, 'id'>) }))
          .sort((left, right) => {
            const leftTime = (left.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
            const rightTime = (right.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
            return rightTime - leftTime;
          })
      );
    },
    (error) => {
      console.warn('Admin reported books listener failed:', error);
      callback([]);
    }
  );
};

export const blockUser = async (userId: string) => {
  const db = getDbOrThrow();
  await updateDoc(doc(db, 'users', userId), { blocked: true });
};

export const unBlockUser = async (userId: string) => {
  const db = getDbOrThrow();
  await updateDoc(doc(db, 'users', userId), { blocked: false });
};

export const setBookReportStatus = async (bookId: string, reported: boolean) => {
  const db = getDbOrThrow();
  await updateDoc(doc(db, 'books', bookId), { reported });
};
