import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { getDbOrThrow } from '@/src/config/firebase';
import { markBookAsSold } from '@/src/services/bookService';
import type { Order } from '@/src/utils/types';

export const createOrder = async (payload: Omit<Order, 'id' | 'createdAt'>) => {
  const db = getDbOrThrow();
  const ordersCollection = collection(db, 'orders');
  await addDoc(ordersCollection, {
    ...payload,
    createdAt: serverTimestamp(),
  });

  await markBookAsSold(payload.bookId);
};

export const subscribeToBuyerOrders = (buyerId: string, callback: (orders: Order[]) => void) => {
  const db = getDbOrThrow();
  const ordersCollection = collection(db, 'orders');
  const q = query(ordersCollection, where('buyerId', '==', buyerId));

  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }))
          .sort((left, right) => {
            const leftTime = (left.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
            const rightTime = (right.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
            return rightTime - leftTime;
          })
      );
    },
    (error) => {
      console.warn('Orders listener failed:', error);
      callback([]);
    }
  );
};
