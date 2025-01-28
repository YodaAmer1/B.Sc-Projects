import React, { useContext, useState } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { logout,getCurrentUser } from "../services/authHandler"; 
import { ThemeContext } from "../App";
import { auth } from "../firebase"
import {
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaHome,
  FaSchool,
  FaListAlt,
  FaChartBar,
  FaChair,
} from "react-icons/fa";

const Sidebar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = getCurrentUser();
  const teacherName = currentUser?.displayName || "Teacher";
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const pageTitles = {
    "/Dashboard": "home",
    "/my-classes": "My Classes",
    "/show-students": "Show students for queestionnaire",
    "/Analytics": "Analytics",
    "/generate-seating": "Seating Arrangement",
    "/login": "Login",
    "/register": "Register",
  };
  const currentPath = location.pathname.split('/')[1]; // Get the first segment of the path
const dynamicPaths = {
  "questionnaire": "Questionnaire",
  "show-results": "Questionnaire Results",
  "view-students": "Student management",
};



  const handleNavigation = (path) => {
    if (!currentUser && path !== "/Dashboard") {
      setShowAlert(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 500);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsLoading(false);
      navigate(path);
    }, 500);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
  
      
      await Promise.all([logout(), new Promise((resolve) => setTimeout(resolve, 1000))]);
  
      navigate("/login");
    } catch (error) {
      console.error("Error during logout: ", error);
      alert("Failed to log out. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const styles = {
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "270px",
      height: "100vh",
      zIndex: 1000, 
      backgroundColor: theme === "light" ? "#f4f4f4" : "#1E1E1E",
      color: theme === "light" ? "#333" : "#f9f9f9",
      boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "30px 20px",
      transform: "translateY(-50px)", 
    },
    virtualClassroom: {
      fontSize: "45px",
      fontWeight: "bold",
      color: "transparent",
      textTransform: "uppercase",
      background:
      //"#7e93a2" : "#0d2b39"
      "linear-gradient(90deg,#0d2b39,#7e93a2 , #000 ,#fff ,#7e93a2 ,#0d2b39)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      backgroundSize: "400% 400%",
      animation: "moveGradient 8s linear infinite", // Smoother animation
      textShadow:
        theme === "light"
          ? "2px 2px 4px rgba(0, 0, 0, 0.3)"
          : "2px 2px 4px rgba(255, 255, 255, 0.3)", // Shadow for better readability
      textAlign: "center",
      marginBottom: "30px",
    },
    
    welcome: {
      fontSize: "25px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "30px",
    },
    menu: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px 20px",
      fontSize: "18px",
      fontWeight: "bold",
      borderRadius: "8px",
      backgroundColor: theme === "light" ? "#ffffff" : "#333333",
      color: theme === "light" ? "#333" : "#f9f9f9",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    activeMenuItem: {
      backgroundColor: theme === "light" ? "#7e93a2" : "#0d2b39", // Active color
      color: theme === "light" ? "#000" : "#fff", // Active text color
      transform: "scale(1.05)", // Slightly enlarge active menu item
    },
    menuItemHover: {
    backgroundColor: theme === "light" ? "#f1f3f5" : "#555555",
    transform: "scale(1.05)",
  },
  darkModeToggle: {
    marginTop: "50px",
    marginLeft : "115px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "35px", // Circular button size
    height: "35px",
    borderRadius: "50%", // Circle shape
    cursor: "pointer",
    backgroundColor: "transparent", // No background
    color: "#FFD700", // Yellow color for both icons
    fontSize: "15px", // Icon size
    boxShadow: theme === "light"
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "0 2px 6px rgba(0, 0, 0, 0.3)", // Subtle shadow for modern look
    transition: "all 0.3s ease", // Smooth transitions for hover and toggling
  },

  darkModeToggleHover: {
    backgroundColor: theme === "light" ? "#e0e0e0" : "#666",
    transform: "scale(1.05)", // Slightly enlarge on hover
    boxShadow: theme === "light"
      ? "0 4px 8px rgba(0, 0, 0, 0.15)"
      : "0 4px 8px rgba(0, 0, 0, 0.4)", // Enhanced shadow effect
  },

    spinner: {
      border: "8px solid #f3f3f3",
      borderTop: "8px solid #3498db",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      animation: "spin 1s linear infinite",
    },
    menuItemLogout: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px 20px",
      fontSize: "18px",
      fontWeight: "bold",
      borderRadius: "8px",
      backgroundColor: "#e51515", // Default background
      color: theme === "light" ? "#333" : "#f9f9f9",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    Logo : {
      
    },
    pageHeader: {
      position: "fixed",
      top: 0,
      left: "270px", // Matches the sidebar width
      width: "calc(100% - 270px)", // Adjusts to fit outside the sidebar
      height: "100px", 
      backgroundColor: theme === "light" ? "#7e93a2" : "#0d2b39", 
      color: theme === "light" ? "#000" : "#fff", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
      zIndex: 900, 
      borderBottom: "2px solid rgba(0, 0, 0, 0.1)", 
    },
    
    headerTitle: {
      fontSize: "30px", 
      fontWeight: "bold",
      margin: 0,
      textTransform: "uppercase", 
    },
    loginButtonContainer: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
    },
    loginButton: {
      padding: "12px 20px", // Larger padding for better clickability
      fontSize: "18px", // Slightly larger font for readability
      fontWeight: "bold",
      borderRadius: "12px", // Smoother corners for a modern look
      backgroundColor: theme === "light" ? "#000" : "#fff", // Bright and noticeable colors
      color: theme === "light" ? "#fff" : "#000", // Ensure high contrast for readability
      border: "none",
      cursor: "pointer",
      textTransform: "uppercase", // Make text stand out
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add depth with shadow
      transition: "all 0.3s ease",
      animation: "pulse 1.2s infinite",
    },
    
  };

  return (
    <>

  
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={styles.spinner}></div>
        </div>
      )}
  
      {showAlert && (
        <div
          style={{
            
          }}
        >
          <p style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
            You must log in to access this page.
          </p>
          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: theme === "light" ? "#4CAF50" : "#6C757D",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={() => setShowAlert(false)}
          >
            Close
          </button>
        </div>
      )}
  {/* Include @keyframes for sidebar gradient */}
  <style>
    {`
      @keyframes moveGradient {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
      @keyframes headerFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
        @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    `}
  </style>

  {/* Dynamic Header */}
  <div style={styles.pageHeader}>
    <h2 style={styles.headerTitle}>
      {pageTitles[location.pathname] || dynamicPaths[currentPath]|| "Virtual ClassRoom"}
    </h2>
  {(location.pathname === "/Dashboard" || location.pathname === "/register") && !currentUser && (
    <div style={styles.loginButtonContainer}>
      <button
        style={styles.loginButton}
        onMouseEnter={(e) => {
          e.target.style.animation = "pulse 1.2s infinite"; // Add animation
          e.target.style.transform = "scale(1.1)"; 
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = ""; // Reset size
        }}
        onClick={() => navigate("/login")}
      >
        Log In
      </button>
    </div>
  )}
  </div>
  <button onClick={() => setIsOpen(!isOpen)} className="toggle-button">
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div style={styles.sidebar}>
        {/* Logo Container */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="/vc logo.png"
          alt="Logo"
          className="logoAnimation"
          style={{
            width: "250px",
            height: "250px",
            objectFit: "cover",
            borderRadius: "50%",
            marginBottom: "-20px",
        }}
        />

      <style>
        {`
        .logoAnimation {
         animation: fadeAnimation 2s infinite alternate, pulse 3s infinite alternate;
        }

       @keyframes fadeAnimation {
         0% {
            opacity: 0.7; /* Half-transparent */
          }
          100% {
           opacity: 1; /* Fully visible */
         }
       }
          @keyframes pulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      `}
      </style>

        </div>
  
        {/* Sidebar Title */}
        <h1 style={styles.virtualClassroom}>Virtual Classroom</h1>
  
        {/* Welcome Message */}
        <div style={styles.welcome}>Welcome, {teacherName}</div>
  
        {/* Sidebar Menu */}
        <div style={styles.menu}>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === "/Dashboard" && styles.activeMenuItem),
            }}
            onClick={() => handleNavigation("/Dashboard")}
          >
            <FaHome style={{ fontSize: "20px" }} />
            Home
          </div>
          {currentUser && (
            <>
              <div
                style={{
                  ...styles.menuItem,
                  ...(location.pathname === "/my-classes" && styles.activeMenuItem),
                }}
                onClick={() => handleNavigation("/my-classes")}
              >
                <FaSchool style={{ fontSize: "20px" }} />
                My Classes
              </div>
              <div
                style={{
                  ...styles.menuItem,
                  ...(location.pathname === "/show-students" && styles.activeMenuItem),
                }}
                onClick={() => handleNavigation("/show-students")}
              >
                <FaListAlt style={{ fontSize: "20px" }} />
                Questionnaire
              </div>
              <div
                style={{
                  ...styles.menuItem,
                  ...(location.pathname === "/Analytics" && styles.activeMenuItem),
                }}
                onClick={() => handleNavigation("/Analytics")}
              >
                <FaChartBar style={{ fontSize: "20px" }} />
                Analytics
              </div>
              <div
                style={{
                  ...styles.menuItem,
                  ...(location.pathname === "/generate-seating" && styles.activeMenuItem),
                }}
                onClick={() => handleNavigation("/generate-seating")}
              >
                <FaChair style={{ fontSize: "20px" }} />
                Seating Arrangement
              </div>
              {location.pathname !== "/login" &&
                location.pathname !== "/register" && (
                  <div
                    style={styles.menuItemLogout}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#a40909")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#e51515")
                    }
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt style={{ fontSize: "20px" }} />
                    Logout
                  </div>
                )}
            </>
          )}
        </div>
  
        {/* Dark Mode Toggle */}
        <div
          style={styles.darkModeToggle}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.darkModeToggleHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.darkModeToggle)}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <FaSun style={{ color: "#000" }} />
          ) : (
            <FaMoon style={{ color: "#FFD700" }} />
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes moveGradient {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      {/* Add Margin to Main Content */}
    <div style={{ marginTop: "70px" }}>
    </div>
    </div>
    </>
  );
  
};

export default Sidebar;