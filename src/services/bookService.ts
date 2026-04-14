import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  getDocs,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';
import { getDbOrThrow, getStorageOrThrow } from '@/src/config/firebase';
import type { BookCondition, BookListing } from '@/src/utils/types';

export interface BookFilter {
  minPrice?: number;
  maxPrice?: number;
  condition?: BookCondition | 'All';
}

const getBooksCollection = () => collection(getDbOrThrow(), 'books');

const normalizeText = (value: string) => value.trim().toLowerCase();

const uploadBookImage = async (payload: { userId: string }, imageUri: string) => {
  if (Platform.OS === 'web') {
    return imageUri;
  }

  const storage = getStorageOrThrow();
  const filename = `${payload.userId}/${Date.now()}.jpg`;
  const imageRef = ref(storage, `books/${filename}`);
  const response = await fetch(imageUri);
  const blob = await response.blob();

  await uploadBytes(imageRef, blob);
  return getDownloadURL(imageRef);
};

const findDuplicateBookForUser = async (
  userId: string,
  title: string,
  author: string,
  excludeBookId?: string
) => {
  const snapshot = await getDocs(query(getBooksCollection(), where('userId', '==', userId)));
  const normalizedTitle = normalizeText(title);
  const normalizedAuthor = normalizeText(author);

  return snapshot.docs.some((entry) => {
    if (excludeBookId && entry.id === excludeBookId) return false;

    const data = entry.data() as BookListing;
    return (
      data.status === 'active' &&
      normalizeText(data.title) === normalizedTitle &&
      normalizeText(data.author) === normalizedAuthor
    );
  });
};

export const createBookListing = async (
  payload: {
    title: string;
    author: string;
    price: number;
    condition: BookCondition;
    description?: string;
    userId: string;
    sellerName: string;
  },
  imageUri: string
) => {
  const booksCollection = getBooksCollection();
  const duplicateExists = await findDuplicateBookForUser(
    payload.userId,
    payload.title,
    payload.author
  );

  if (duplicateExists) {
    throw new Error('You already listed this book. Edit the existing listing instead.');
  }

  const imageUrl = await uploadBookImage(payload, imageUri);

  await addDoc(booksCollection, {
    ...payload,
    imageUrl,
    status: 'active',
    createdAt: serverTimestamp(),
  });
};

export const subscribeToBooks = (
  callback: (books: BookListing[]) => void,
  filters?: BookFilter
) => {
  const booksCollection = getBooksCollection();
  const q = query(booksCollection);

  const sortBooks = (books: BookListing[]) =>
    books.sort((left, right) => {
      const leftTime = (left.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
      const rightTime = (right.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
      return rightTime - leftTime;
    });

  return onSnapshot(
    q,
    (snapshot) => {
      let books = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<BookListing, 'id'>) }))
        .filter((book) => book.status === 'active');

      if (filters?.minPrice !== undefined) {
        books = books.filter((book) => book.price >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        books = books.filter((book) => book.price <= filters.maxPrice!);
      }
      if (filters?.condition && filters.condition !== 'All') {
        books = books.filter((book) => book.condition === filters.condition);
      }

      callback(sortBooks(books));
    },
    (error) => {
      console.warn('Books listener failed:', error);
      callback([]);
    }
  );
};

  export const getBookListingById = async (bookId: string) => {
    const db = getDbOrThrow();
    const snapshot = await getDoc(doc(db, 'books', bookId));

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...(snapshot.data() as Omit<BookListing, 'id'>) };
  };

  export const updateBookListing = async (
    bookId: string,
    payload: {
      title: string;
      author: string;
      price: number;
      condition: BookCondition;
      description?: string;
      userId: string;
      sellerName: string;
    },
    imageUri?: string
  ) => {
    const db = getDbOrThrow();
    const existing = await getBookListingById(bookId);

    if (!existing) {
      throw new Error('The book you are trying to edit no longer exists.');
    }

    const duplicateExists = await findDuplicateBookForUser(
      payload.userId,
      payload.title,
      payload.author,
      bookId
    );

    if (duplicateExists) {
      throw new Error('You already have another listing for this book. Update the existing one instead.');
    }

    const nextImageUrl = imageUri ? await uploadBookImage(payload, imageUri) : existing.imageUrl;

    await updateDoc(doc(db, 'books', bookId), {
      ...payload,
      imageUrl: nextImageUrl,
      status: 'active',
      createdAt: existing.createdAt ?? serverTimestamp(),
    });
  };

export const loadBooksPage = async (
  pageSize = 10,
  cursor?: QueryDocumentSnapshot<DocumentData>
) => {
  const booksCollection = getBooksCollection();
  const q = cursor
    ? query(booksCollection, startAfter(cursor), limit(pageSize))
    : query(booksCollection, limit(pageSize));

  const snapshot = await getDocs(q);
  const books = snapshot.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<BookListing, 'id'>) }))
    .filter((book) => book.status === 'active')
    .sort((left, right) => {
      const leftTime = (left.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
      const rightTime = (right.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
      return rightTime - leftTime;
    });

  return {
    books,
    cursor: snapshot.docs.at(-1),
    hasMore: snapshot.docs.length === pageSize,
  };
};

export const markBookAsSold = async (bookId: string) => {
  const db = getDbOrThrow();
  await updateDoc(doc(db, 'books', bookId), { status: 'sold' });
};

export const deleteBookListing = async (bookId: string) => {
  const db = getDbOrThrow();
  await updateDoc(doc(db, 'books', bookId), { status: 'removed' });
};

export const subscribeToUserBooks = (userId: string, callback: (books: BookListing[]) => void) => {
  const booksCollection = getBooksCollection();
  const q = query(booksCollection, where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const books = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<BookListing, 'id'>) }))
        .sort((left, right) => {
          const leftTime = (left.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
          const rightTime = (right.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
          return rightTime - leftTime;
        });
      callback(books);
    },
    (error) => {
      console.warn('User books listener failed:', error);
      callback([]);
    }
  );
};
