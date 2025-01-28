import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShowStudents from "./pages/ShowStudents";
import GenerateSeating from "./pages/GenerateSeating";
import Questionnaire from "./pages/Questionnaire";
import ShowQuesResults from "./pages/ShowQuesResults";
import MyClassesPage from "./pages/MyClassesPage"; // Import the "My Classes" page
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar"; // Modularized Header
import ViewStudentsPage from "./pages/ViewStudentsPage";
import Analytics from "./pages/Analytics";
import Layout from './components/Layout';


// Create a Theme Context
export const ThemeContext = createContext();

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 3 minutes inactivity timeout

const App = () => {
  const [theme, setTheme] = useState("light");
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  // Load the saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Inactivity timeout logic
  useEffect(() => {
    let timeout;

    const logoutOnInactivity = () => {
      if (isLoggedIn) {
        signOut(auth)
          .then(() => {
            alert("You have been logged out due to inactivity.");
            window.location.href = "/login";
          })
          .catch((error) => console.error("Error during logout:", error));
      }
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      if (isLoggedIn) {
        timeout = setTimeout(logoutOnInactivity, INACTIVITY_TIMEOUT);
      }
    };

    // Attach event listeners
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // Start the timer initially if logged in
    resetTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [auth, isLoggedIn]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout>
      <div
        style={{
          backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
          color: theme === "light" ? "#333" : "#f9f9f9",
          minHeight: "100vh",
        }}
      >
        <Router>
        <Sidebar teacherName={currentUser?.displayName || "Teacher"} />
          <Routes>
            <Route path="/" element={<Navigate to="/Dashboard" />} />
            <Route path="/login" element={< LoginPage />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterPage />} />


            <Route
              path="/show-students"
              element={
                <PrivateRoute>
                  <ShowStudents />
                </PrivateRoute>
              }
            />

            <Route
              path="/generate-seating"
              element={
                <PrivateRoute>
                   <GenerateSeating teacherId={currentUser?.uid} />
                </PrivateRoute>
              }
            />
            <Route
              path="/questionnaire/:studentId"
              element={
                <PrivateRoute>
                  <Questionnaire />
                </PrivateRoute>
              }
            />
            <Route
              path="/show-results/:studentId"
              element={
                <PrivateRoute>
                  <ShowQuesResults />
                </PrivateRoute>
              }
            />
           <Route
  path="/my-classes"
  element={
    <PrivateRoute>
      <MyClassesPage
        teacherId={currentUser?.uid}
        teacherName={currentUser?.displayName}
      />
    </PrivateRoute>
  }
/>
<Route
  path="/view-students/:classId"
  element={
    <PrivateRoute>
      <ViewStudentsPage />
    </PrivateRoute>
  }
/>
<Route
  path="/Analytics"
  element={
    <PrivateRoute>
      <Analytics />
    </PrivateRoute>
  }
/>
          </Routes>
        </Router>
      </div>
      </Layout>
    </ThemeContext.Provider>
  );
};

export default App;