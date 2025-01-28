import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ThemeContext } from "../App"; // Import ThemeContext
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerUser } from "../services/authHandler"; 
import { addTeacher,getAllTeachers } from "../services/teacherHandler"; 




const RegisterPage = () => {
  const { theme } = useContext(ThemeContext); // Access theme
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(""); // eslint-disable-line no-unused-vars
  const navigate = useNavigate(); // Initialize navigate
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const allowedDomains = ["gmail.com", "walla.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

const isEmailDomainValid = (email) => {
  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isEmailDomainValid(formData.email)) {
      setAlertMessage("Invalid email domain. Please use a valid email.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }
  
    try {
      const teachers = await getAllTeachers();
      const emailExists = teachers.some((teacher) => teacher.email === formData.email);
  
      if (emailExists) {
        setAlertMessage("This email is already registered. Please use a different email.");
        setAlertType("error");
  
        setTimeout(() => setAlertMessage(""), 2000);
        return;
      }
  
      const user = await registerUser(formData.email, formData.password, formData.name);
      await addTeacher(user.uid, {
        name: formData.name,
        email: formData.email,
      });
  
      setAlertMessage(`Registration successful! Welcome, ${user.email}.`);
      setAlertType("success");
  
      setTimeout(() => {
        setAlertMessage("");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setAlertMessage(err.message || "An unexpected error occurred.");
      setAlertType("error");
  
      setTimeout(() => setAlertMessage(""), 2000);
    }
  };
  
  
  const styles = {
    pageContainer: {
      display: "flex",
      flexDirection: "row",
      padding: "20px",
      marginRight:"150px",
      boxSizing: "border-box",
      flexWrap: "wrap",
      maxHeight: "100vh", 
    position: "relative",
    },
    
    sidebarSpacing: {
      width: "300px", // Adjust according to your sidebar width
      flexShrink: 0,
    },
    mainContent: {
      flex: 1,
      marginLeft: "250px",
      marginBottom: "500px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "300px",
      "@media (idth: 768px)": {
    marginLeft: "0", 
    marginTop: "50px", 
  },
    },
    container: {
      position: "relative",
      padding: "14px",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
      color: theme === "light" ? "#333" : "#f9f9f9",
      borderRadius: "12px",
      boxShadow: theme === "light"
        ? "0 4px 20px rgba(0, 0, 0, 0.1)"
        : "0 4px 20px rgba(0, 0, 0, 0.4)",
      fontFamily: "'Roboto', sans-serif",
      
      "@media (maxWidth: 768px)": {
    width: "90%", // Reduce width for smaller screens
    padding: "20px", // Adjust padding for compact view
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
      height: "15px",
      padding: "12px",
      borderRadius: "8px",
      border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
      color: theme === "light" ? "#333" : "#f9f9f9",
      fontSize: "25px",
      outline: "none",
      boxShadow: theme === "light"
        ? "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
        : "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
      transition: "all 0.3s ease",
      "@media (maxWidth: 768px)": {
    height: "40px", // Reduce height for smaller screens
    fontSize: "16px", // Smaller font size for mobile
  },
    },
    button: {
      padding: "15px",
      borderRadius: "8px",
      width:"102%",
      backgroundColor: "#4CAF50" ,
      color: "#fff",
      fontSize: "18px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      boxShadow: theme === "light"
        ? "0 4px 10px rgba(0, 0, 0, 0.1)"
        : "0 4px 10px rgba(255, 255, 255, 0.1)",
    },
    buttonHover: {
      backgroundColor: theme === "light" ? "#45A049" : "#555", // Slightly darker color on hover
      transform: "scale(1.02)", // Enlarge slightly on hover
      boxShadow: theme === "light"
        ? "0 6px 15px rgba(0, 0, 0, 0.2)"
        : "0 6px 15px rgba(255, 255, 255, 0.2)", // Enhanced shadow effect
    },
    inputIcon: {
      position: "absolute",
      top: "50%",
      right: "10px", // Adjust based on padding
      transform: "translateY(-50%)",
      color: theme === "light" ? "#333" : "#f9f9f9",
      fontSize: "18px",
    },
    inputWrapper: {
      position: "relative",
      width: "100%",
      marginBottom: "15px",
    },
    alertMessage: {
      position: "absolute", // Positioned relative to the parent container
      top: "20px", // Adjusted to 20px above the register container
      left: "50%",
      transform: "translateX(-50%)",
      padding: "15px 20px",
      borderRadius: "8px",
      backgroundColor: alertType === "success" ? "#4CAF50" : "#F44336",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      textAlign: "center",
    }
  };





  return (
    
    <div style={styles.pageContainer}>
      <div style={styles.sidebarSpacing}></div>
      <div style={styles.mainContent}>
      <div style={styles.container}>
      {alertMessage && (
      <div
        style={styles.alertMessage}
      >
        {alertMessage}
      </div>
    )}
<h2 style={styles.header}>Sign Up</h2>
{error && <p style={styles.error}>{error}</p>}
<form onSubmit={handleSubmit} style={styles.form}>
<div style={styles.inputWrapper}>
<FaUser style={styles.inputIcon} />
  <input
    type="text"
    name="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
    required
    style={styles.input}
  />
  </div>
  <div style={{ ...styles.inputWrapper, position: "relative" }}>
  <FaEnvelope style={styles.inputIcon} />
  <input
    type="email"
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    required
    style={{
      ...styles.input,
      borderColor:
        formData.email && !isEmailDomainValid(formData.email) ? "red" : "",
    }}
  />
  {formData.email && !isEmailDomainValid(formData.email) && (
    <p
      style={{
        color: theme === "light"?"red":"#fe2b2b",
        fontSize: "12px",
        marginLeft: "5px",
        position: "absolute",
        top: "90%", // Position it below the input field
        left: 0,
      }}
    >
      Please use a valid email domain (Gmail, ,Yahoo, etc..).
    </p>
  )}
</div>


  <div style={styles.inputWrapper}>
   <FaLock style={styles.inputIcon} />
  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
    style={styles.input}
  />
  </div>
  <button
  type="submit"
  style={styles.button}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = theme === "light" ? "#007bff" : "#555";
    e.target.style.transform = "scale(1.02)";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "#4CAF50";
    e.target.style.transform = "scale(1)";
  }}
  onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
>
Create Account
</button>


</form>
</div>
</div>
</div>

  );
};

export default RegisterPage;