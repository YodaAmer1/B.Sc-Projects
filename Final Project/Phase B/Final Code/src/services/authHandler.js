import {  getAuth,signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,signOut,sendPasswordResetEmail   } from "firebase/auth";
import { db ,auth} from "../firebase";
import { doc, setDoc } from "firebase/firestore";


export const getCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};
// Sign in user
export const signInUser = async (email, password) => {
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error during sign out:", error.message);
    throw error;
  }
};
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
};
// Register user
export const registerUser = async (email, password, name) => {
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    const teacherRef = doc(db, "Teachers", user.uid);
    await setDoc(teacherRef, {
      name,
      email,
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};
