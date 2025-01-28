import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../App" 
import { FaUser, FaLock } from "react-icons/fa"
import { resetPassword,signInUser } from "../services/authHandler";
import { getAllTeachers,getTeacherById } from "../services/teacherHandler";

  
const LoginPage = () => {
 const { theme } = useContext(ThemeContext)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error] = useState("")
  const navigate = useNavigate()
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotError, setForgotError] = useState("")
  const [forgotSuccess, setForgotSuccess] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("")

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe) {
      setRememberMe(true);
      const savedEmail = localStorage.getItem("email");
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail }));
      }
    }
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      setForgotError("Please enter your email.")
      return
    }

    try {
      const teachers = await getAllTeachers();
      const doesEmailExist = teachers.some((teacher) => teacher.email === forgotEmail);
  
  
      if (!doesEmailExist) {
        setForgotError("Email not found. Please check the entered email.")
        setForgotSuccess("") 
        return
      }
  
        await resetPassword(forgotEmail);
          setForgotSuccess("Password reset email sent. Please check your inbox.")
          setForgotError("") 
        }catch(error){
          if (error.message === 'Firebase: Error (auth/invalid-email).') {
            setForgotError("Invalid email. Please try again.")
            setForgotSuccess("")
          } else {
            console.error("Error sending password reset email: ", error)
            setForgotError("Failed to send password reset email. Please try again.")
          }
          setForgotSuccess("") 
        }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rememberMe) {
      localStorage.setItem("email", formData.email)
    } else {
      localStorage.removeItem("email")
    }
    try {
      const user = await signInUser(formData.email, formData.password);

      const teacherDoc = await getTeacherById(user.uid);
      if (teacherDoc.exists()) {
        console.log("Teacher Data:", teacherDoc.data())
        setAlertMessage("Logged in successfully!")
        setAlertType("success")

        setTimeout(() => {
          setAlertMessage("")
          navigate("/Dashboard")
        }, 2000)
      } else {
        throw new Error("No teacher record found. Please contact support.")
      }
    } catch (err) {
      setAlertMessage("Incorrect Login ID and/or password.")
      setAlertType("error")
      setTimeout(() => setAlertMessage(""), 2000)
    }
  };
  
  

 const handleRememberMe = () => {
  const newValue = !rememberMe;
  setRememberMe(newValue);
  
  // Save the state to localStorage
  if (newValue) {
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem("rememberMe");
  }
};

    const styles = {
      pageContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
        color: theme === "light" ? "#333" : "#f9f9f9",
        boxSizing: "border-box",
        flexWrap: "wrap",
        
      },
      sidebarSpacing: {
        width: "300px",
        flexShrink: 0,
      },
      mainContent: {
        flex: 1,
        marginLeft: "250px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme === "light" ? "#ffffff" : "#1E1E1E",
        borderRadius: "12px",
        boxShadow: theme === "light"
          ? "0 4px 8px rgba(0, 0, 0, 0.1)"
          : "0 4px 8px rgba(0, 0, 0, 0.5)",
          
      },
      container: {
        padding: "40px",
        maxWidth: "400px", // Adjusted width
        width: "100%", // Ensures full width
        backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
        color: theme === "light" ? "#333" : "#f9f9f9",
        borderRadius: "12px",
        boxShadow: theme === "light"
          ? "0 4px 20px rgba(0, 0, 0, 0.1)"
          : "0 4px 20px rgba(0, 0, 0, 0.4)",
        fontFamily: "'Roboto', sans-serif",
        transform: "translateY(0)",
        "@media (max-width: 768px)": {
    padding: "20px", // Reduce padding for smaller screens
    maxWidth: "90%", // Adjust max width for small screens
  },
      },
      header: {
        textAlign: "center",
        fontSize: "28px",
        color: theme === "light" ? "#333" : "#f9f9f9",
        marginBottom: "20px",
        fontWeight: "bold",
      },
      error: {
        color: "#e74c3c",
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: "bold",
      },
      form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      },
      input: {
        width: "95%",
        height: "50px",
        padding: "12px",
        borderRadius: "8px",
        border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
        backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
        color: theme === "light" ? "#333" : "#f9f9f9",
        fontSize: "16px",
        outline: "none",
        boxShadow: theme === "light"
          ? "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
          : "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
        "@media (maxWidth: 480px)": {
    fontSize: "14px", // Smaller font for small screens
    height: "40px", // Adjust height for smaller devices
  },
      },
      button: {
        width: "103%",
        height: "50px",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
        textTransform: "uppercase",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      },
      buttonHover: {
        backgroundColor: "#45A049",
        transform: "scale(0.98)",
      },
      signUpButton: {
        width: "103%",
        padding: "15px 20px",
        backgroundColor: theme === "light" ? "#fff" : "#1E1E1E",
        color: theme === "light" ? "#000" : "#f9f9f9",
        border: "1px solid",
        borderColor: theme === "light" ? "#ccc" : "#444",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        textTransform: "uppercase",
        marginTop: "15px",
        transition: "all 0.3s ease",
        boxShadow: theme === "light"
          ? "0 2px 4px rgba(0, 0, 0, 0.1)"
          : "0 2px 4px rgba(255, 255, 255, 0.1)",
      },
      alertMessage: {
        position: "absolute",
        top: "150px",
        left: "60%",
        transform: "translateX(-50%)",
        backgroundColor: alertType === "success" ? "#4CAF50" : "#F44336",
        color: "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        fontWeight: "bold",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      },
      inputWrapper: {
        position: "relative",
        width: "95%", // Matches the width of the input field
        marginBottom: "20px", // Space between inputs
      },
      inputWithIcon: {
        width: "100%",
        height: "50px",
        padding: "12px 12px 12px 40px", // Adjust padding to make room for the icon
        borderRadius: "8px",
        border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
        backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
        color: theme === "light" ? "#333" : "#f9f9f9",
        fontSize: "16px",
        outline: "none",
        boxShadow: theme === "light"
          ? "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
          : "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
      },
      icon: {
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        color: theme === "light" ? "#777" : "#ccc",
        fontSize: "20px",
      },
      footer: {
        backgroundColor: theme === "light" ? "#333" : "#444",
        color: "#fff",
        textAlign: "center",
        marginLeft: "150px",
        padding: "50px",
        width: "93%",
        
        boxShadow: theme === "light"
          ? "0 -4px 10px rgba(0, 0, 0, 0.1)"
          : "0 -4px 10px rgba(0, 0, 0, 0.4)",
      },
      footerContainer: {
        
        width: "100%",
        backgroundColor: theme === "light" ? "#333" : "#1E1E1E",
        color: "#fff",
        padding: "40px 20px",
        textAlign: "center",
        borderTop: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      },
      footerContent: {
        
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "20px",
      },
      footerColumn: {
        flex: "1 1 calc(25% - 20px)",
        textAlign: "center",
      },
      footerHeader: {
        fontWeight: "bold",
        marginTop: "-20px",
        fontSize: "20px",
        borderBottom: "2px solid #fff",
        paddingBottom: "5px",
      },
      footerLink: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "14px",
        marginBottom: "10px",
        display: "block",
        transition: "color 0.3s ease",
      },
      footerLinkHover: {
        color: theme === "light" ? "#4CAF50" : "#90CAF9",
      },
      footerCopyright: {
        marginTop: "20px",
        fontSize: "14px",
        color: "#000",
        textAlign: "center",
      },
      newsletterInput: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #bbb",
        width: "calc(100% - 110px)",
        marginRight: "10px",
        backgroundColor: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#333" : "#fff",
      },
      newsletterButton: {
        padding: "12px 25px",
        backgroundColor: theme === "light" ? "#4CAF50" : "#90CAF9",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      },
      footerWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 0",
        backgroundColor: theme === "light" ? "#7e93a2" :"#0d2b39",
        color: "#ffffff",
        textAlign: "center",
        borderTop: "1px solid #ccc",
        zIndex: 0,
        width: "100%",
        "@media (maxWidth: 768px)": {
    flexDirection: "column", // Stack footer content vertically
    padding: "10px", // Reduce padding
  },
      },
      footerSpacing: {
        width: "300px",
        flexShrink: 0,
      },
      footerContentArea: {
        flex: 1,
        padding: "20px",
      },
      socialIcons: {
        display: "flex",
        marginRight: "10px",
        gap: "40px",
        justifyContent: "center",
        marginTop: "20px",
      },
      socialIcon: {
        fontSize: "30px",
        textDecoration: "none",
        transition: "transform 0.3s ease, color 0.3s ease",
        cursor: "pointer",
      },
      facebookIcon: {
        color: "#1877F2",
      },
      twitterIcon: {
        color: "#1DA1F2",
      },
      linkedinIcon: {
        color: "#0077B5",
      },
      socialText: {
        marginTop: "10px",
        fontSize: "14px",
        color: "#fff",
      },
      socialIconContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    }
  
  return (
    <div style={styles.pageContainer}>
      {alertMessage && (
        <div
          style={styles.alertMessage}
        >
          {alertType === "success" ? (
            <span style={{ fontSize: "24px" }}>✔</span> 
          ) : (
            <span style={{ fontSize: "24px" }}>✖</span> 
          )}
          <span>{alertMessage}</span>
        </div>
      )}
      <div style={styles.scrollableContainer}></div>
      <div style={styles.sidebarSpacing}></div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.container}>
          <h2 style={styles.header}>Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form style={styles.form}>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.icon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <button
              type="submit"
              style={styles.button}
              onClick={handleSubmit}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#45A049")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              Log In
            </button>
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </p>
            {showForgotPassword && (
              <div
                style={{
                  backgroundColor: theme === "light" ? "#f9f9f9" : "#1E1E1E",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                {/* "X" Close Button */}
                <button
                  onClick={() => setShowForgotPassword(false)} 
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    marginLeft: "350px",
                    marginTop: "-10px",
                    color: theme === "light" ? "#333" : "#fff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
                <h3 style={{ marginBottom: "15px", color: theme === "light" ? "#333" : "#fff" }}>
                  Reset Password
                </h3>

                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: "95%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: theme === "light" ? "1px solid #ccc" : "1px solid #444",
                    backgroundColor: theme === "light" ? "#fff" : "#2C2C2C",
                    color: theme === "light" ? "#333" : "#fff",
                  }}
                />
                {forgotError && <p style={{ color: "red" }}>{forgotError}</p>}
                {forgotSuccess && <p style={{ color: "green" }}>{forgotSuccess}</p>}
                <button
                  onClick={handleForgotPassword}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: theme === "light" ? "#007bff" : "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Submit
                </button>
              </div>
            )}
            <button
              onClick={() => navigate("/register")}
              style={styles.signUpButton}

            >
              I NEED A NEW ACCOUNT
            </button>
          </form>
        </div>
      </div>
      <footer style={styles.footerWrapper}>
        <div style={styles.footerSpacing}></div>
        <div style={styles.footerContentArea}>
          <div style={styles.footerContent}>
            <div style={styles.footerColumn}>
              <h3 style={styles.footerHeader}>About Us</h3>
              <p>Professional project/system offering solutions for classroom management and virtual learning environments.</p>
            </div>

            <div style={styles.footerColumn}>
              <h3 style={styles.footerHeader}>Stay Connected</h3>
              <div style={styles.socialIcons}>
                <link
                  rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                />
                <div style={styles.socialIconContainer}>
                  <a
                    href="https://facebook.com"
                    style={{ ...styles.socialIcon, ...styles.facebookIcon }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <span style={styles.socialText}>Facebook</span>
                </div>
                {/* Twitter */}
                <div style={styles.socialIconContainer}>
                  <a
                    href="https://twitter.com"
                    style={{ ...styles.socialIcon, ...styles.twitterIcon }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <span style={styles.socialText}>Twitter</span>
                </div>
                {/* LinkedIn */}
                <div style={styles.socialIconContainer}>
                  <a
                    href="https://linkedin.com"
                    style={{ ...styles.socialIcon, ...styles.linkedinIcon }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <span style={styles.socialText}>LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.footerCopyright}>
            © {new Date().getFullYear()} Virtual Classroom. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>

  )
}



export default LoginPage