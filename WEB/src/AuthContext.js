import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, fetchUserDataFromFirestore } from "./firebase.js"; // Ensure this points to your Firebase setup file
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "./components/loading.screen.jsx";

// Create a context
const AuthContext = createContext();

// Create a hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Create a provider to wrap the app in the AuthContext
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(); // Add currentUser state
  const [loading, setLoading] = useState(true); // Add loading state
  const [currentUserData, setCurrentUserData] = useState({
    // Add currentUserData state
    displayName: "",
    email: "",
    photoURL: "",
    uid: "",
    wallet: [],
    Transactions: [],
  });

  // Fetch user data from Firestore when the component mounts and the user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user); // Fetch user data if user exists (user is not null)
        // setLoading(false);
      } else {
        setLoading(false);
      }

      console.log("====================================");
      console.log("User:", user);
      console.log("====================================");
    });

    return () => {
      unsubscribe();
    }; // Cleanup subscription on unmount
  }, []);

  // Function to fetch user data from Firestore
  const fetchUserData = async (user) => {
    // Fetch user data here
    if (user) {
      const userData = await fetchUserDataFromFirestore(user);
      setCurrentUserData(userData);
    }
    setLoading(false); // Update loading state to false once user is fetched
  };

  // Create a context value
  const value = {
    currentUser,
    currentUserData,
    loading, // Include loading in the context value
    fetchUserData, // Include fetchUserData function in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
