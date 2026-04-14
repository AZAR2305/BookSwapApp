import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDbOrThrow } from '@/src/config/firebase';
import type { Review } from '@/src/utils/types';

export const createReview = async (payload: Omit<Review, 'id' | 'createdAt'>) => {
  const db = getDbOrThrow();
  const reviewsCollection = collection(db, 'reviews');
  await addDoc(reviewsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
  });

  const userRef = doc(db, 'users', payload.sellerId);
  await updateDoc(userRef, {
    ratingCount: increment(1),
    ratingTotal: increment(payload.rating),
  });
};

export const subscribeToSellerReviews = (
  sellerId: string,
  callback: (reviews: Review[]) => void
) => {
  const db = getDbOrThrow();
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('sellerId', '==', sellerId));

  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }))
          .sort((left, right) => {
            const leftTime = (left.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
            const rightTime = (right.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
            return rightTime - leftTime;
          })
      );
    },
    (error) => {
      console.warn('Reviews listener failed:', error);
      callback([]);
    }
  );
};
