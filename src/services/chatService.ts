import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { getDbOrThrow } from '@/src/config/firebase';
import type { ChatMessage, ChatThread } from '@/src/utils/types';

const getThreadId = (buyerId: string, sellerId: string, bookId: string) =>
  [buyerId, sellerId].sort().join('_') + `_${bookId}`;

export const ensureThread = async (buyerId: string, sellerId: string, bookId: string) => {
  const db = getDbOrThrow();
  const id = getThreadId(buyerId, sellerId, bookId);
  await setDoc(
    doc(db, 'threads', id),
    {
      participants: [buyerId, sellerId],
      bookId,
      updatedAt: serverTimestamp(),
      lastMessage: '',
    },
    { merge: true }
  );
  return id;
};

export const sendMessage = async (threadId: string, senderId: string, text: string) => {
  const db = getDbOrThrow();
  await addDoc(collection(db, 'threads', threadId, 'messages'), {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });

  await setDoc(
    doc(db, 'threads', threadId),
    {
      lastMessage: text,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const subscribeToThreads = (userId: string, callback: (threads: ChatThread[]) => void) => {
  const db = getDbOrThrow();
  const q = query(collection(db, 'threads'), where('participants', 'array-contains', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatThread, 'id'>) })));
    },
    (error) => {
      console.warn('Threads listener failed:', error);
      callback([]);
    }
  );
};

export const subscribeToMessages = (
  threadId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const db = getDbOrThrow();
  const q = query(collection(db, 'threads', threadId, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessage, 'id'>) })));
    },
    (error) => {
      console.warn('Messages listener failed:', error);
      callback([]);
    }
  );
};
