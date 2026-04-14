import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuthOrThrow, getDbOrThrow } from '@/src/config/firebase';
import type { UserProfile } from '@/src/utils/types';

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> => {
  const auth = getAuthOrThrow();
  const db = getDbOrThrow();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  const profile: UserProfile = {
    id: credential.user.uid,
    email,
    displayName,
    role: 'student',
    blocked: false,
    ratingAverage: 0,
    ratingCount: 0,
  };

  await setDoc(doc(db, 'users', credential.user.uid), profile, { merge: true });
  return profile;
};

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(getAuthOrThrow(), email, password);
};

export const logout = async () => signOut(getAuthOrThrow());

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const db = getDbOrThrow();
  const snapshot = await getDoc(doc(db, 'users', userId));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
};

export const updateUserProfile = async (userId: string, payload: Partial<UserProfile>) => {
  const db = getDbOrThrow();
  await updateDoc(doc(db, 'users', userId), payload);
};
