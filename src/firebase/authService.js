import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

/**
 * Handles signing in with Google via popup.
 * If the user is logging in for the first time, it creates a new user document
 * in the 'users' collection with a default role of 'customer'.
 * 
 * @returns {Promise<{user: Object, role: string}>} The user object and their role.
 */
export const loginWithGoogle = async (requestedRole = 'customer') => {
  try {
    // 1. Trigger Google Popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 2. Reference to user's Firestore document
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // 3. For Demo Purposes: We always update/set the role to the requested one
    // In a real app, you would NOT let the user choose to be an admin!
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: requestedRole,
        createdAt: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, { role: requestedRole }, { merge: true });
    }
    
    return { user, role: requestedRole };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Logs the current user out.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
