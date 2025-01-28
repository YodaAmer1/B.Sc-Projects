import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App"; // Ensure the correct path for your App.js
import { getCurrentUser } from "../services/authHandler";
import { getClassesByTeacherID } from "../services/classHandler";
import { getStudentsByClassID } from "../services/studentHandler";



const ShowStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]); // For storing available classes
  const [selectedClass, setSelectedClass] = useState(""); // Currently selected class
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFetchButton, setShowFetchButton] = useState(true);
  const [loading, setLoading] = useState(false); // For showing loading animation

  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext

  // Dynamically update styles based on the theme
  useEffect(() => {
    document.body.style.backgroundColor = theme === "light" ? "#f9f9f9" : "#121212";
    document.body.style.color = theme === "light" ? "#333" : "#f9f9f9";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);

  // Fetch list of classes
  useEffect(() => {
    const fetchClasses = async () => {
      const currentUser = getCurrentUser();
      const teacherId = currentUser?.uid;
      if (!teacherId) {
        console.error("No teacher ID found. Please log in.");
        return;
      }

      try {
        const fetchedClasses = await getClassesByTeacherID(teacherId);

        setClasses(fetchedClasses); // Update state with the filtered classes
      } catch (error) {
        console.error("Error fetching classes: ", error);
      }
    };

    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true); // Start loading animation
  
      if (!selectedClass) {
        console.log("No class selected.");
        setLoading(false);
        return;
      }
  
      const studentList = await getStudentsByClassID(selectedClass);
  
      setStudents(studentList);
      setShowSearch(true);
      setShowFetchButton(false);
    } catch (error) {
      console.error("Error fetching students: ", error);
    } finally {
      setLoading(false); // Ensure loading animation ends
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    pageContainer: {
      display: "flex",
      marginTop:"-80px",
      flexDirection: "row",
      minHeight: "100vh",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
      color: theme === "light" ? "#333" : "#f9f9f9",
      padding: "10px",
      boxSizing: "border-box",
      flexWrap: "wrap",
    },
    sidebarSpacing: {
      width: "280px", // Matches the sidebar width
      flexShrink: 0,
    },
    mainContent: {
      zIndex:0,
      flex: 1,
      marginLeft: "20px", // Adjust spacing from sidebar
      padding: "20px",
      background:"transparent",
      borderRadius: "12px",
      boxShadow: theme === "light"
        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
        : "0 4px 8px rgba(0, 0, 0, 0.5)",
        "@media (maxWidth: 768px)": {
          marginLeft: "0", // Remove left margin for smaller screens
          padding: "10px", // Reduce padding
        },
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: theme === "light" ? "#333" : "#f9f9f9",
    },
    header: {
      backgroundColor: theme === "light" ? "#1E88E5" : "#444",
      color: "#fff",
      padding: "25px",
      borderRadius: "12px",
      textAlign: "center",
      marginBottom: "30px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    },
    headerTitle: {
      fontSize: "40px",
      fontWeight: "bold",
      letterSpacing: "1px",
      margin: 0,
    },
    dropdownContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      gap: "20px",
      "@media (maxWidth: 768px)": {
    flexDirection: "column", // Stack items vertically
    alignItems: "stretch", // Align items to stretch full width
  },
    },
    dropdown: {
      width: "50%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: theme === "light" ? "#F1F5F9" : "#2E3B4E",
      boxShadow: theme === "light" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
      fontSize: "16px",
      color: theme === "light" ? "#333" : "#E0E0E0",
      outline: "none",
      transition: "all 0.3s ease-in-out",
    },
    searchBar: {
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: theme === "light" ? "#F1F5F9" : "#2E3B4E",
      color: theme === "light" ? "#333" : "#E0E0E0",
      boxShadow: theme === "light" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s ease-in-out",
    },
    fetchButton: {
      padding: "12px 25px",
      borderRadius: "10px",
      backgroundColor: "#28A745",
      color: "#fff",
      fontSize: "18px",
      fontWeight: "600",
      textTransform: "uppercase",
      cursor: "pointer",
      border: "none",
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
      transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    },
    tableContainer: {
      borderRadius: "12px",
      backgroundColor: theme === "light" ? "#ffffff" : "#2E3B4E",
      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
      overflowX: "auto",
      maxHeight: "700px",
      border: theme === "light" ? "1px solid #E0E0E0" : "1px solid #555",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "'Roboto', sans-serif",
      color: theme === "light" ? "#333" : "#F9F9F9",
      "@media (maxWidth: 768px)": {
    fontSize: "12px", // Smaller font for mobile
  },
    },
    th: {
      backgroundColor: theme === "light" ? "#4CAF50" : "#3C4049",
      color: "#fff",
      padding: "14px 18px",
      textAlign: "left",
      borderBottom: theme === "light" ? "2px solid #E0E0E0" : "2px solid #555",
      textTransform: "uppercase",
      fontSize: "14px",
      position: "sticky",
      top: 0,
    },
    td: {
      padding: "12px 18px",
      borderBottom: theme === "light" ? "1px solid #E0E0E0" : "1px solid #555",
      fontSize: "14px",
      color: theme === "light" ? "#333" : "#ddd",
    },
    noData: {
      textAlign: "center",
      fontSize: "18px",
      margin: "20px 0",
      color: theme === "light" ? "#999" : "#bbb",
    },
  };



  return (
    <div style={styles.pageContainer}>
      <div style={styles.sidebarSpacing}></div>
      <div style={styles.mainContent}>
        <header style={styles.header}>
        </header>

        <div style={styles.dropdownContainer}>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setShowFetchButton(true); // Show Fetch Button again if a new class is selected
              setStudents([]); // Reset students list
            }}
            style={styles.dropdown}
          >
            <option value="">Select class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {showSearch && (
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBar}
            />
          )}
        </div>

        {showFetchButton && selectedClass &&(
          <button onClick={fetchStudents} style={styles.fetchButton}>
            Fetch Students
          </button>
        )}

        {loading && <p style={styles.loadingMessage}>Loading students...</p>}

        <div style={styles.tableContainer}>
          {filteredStudents.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Academic Level</th>
                  <th style={styles.th}>Behavior</th>
                  <th style={styles.th}>Language</th>
                  <th style={styles.th}>special Needs</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.age}</td>
                    <td style={styles.td}>{student.academicLevel}</td>
                    <td style={styles.td}>{student.behavior}</td>
                    <td style={styles.td}>{student.language}</td>
                    <td style={styles.td}>{student.specialNeeds}</td>

                    <td style={styles.td}>
                      {student.hasSubmitted ? (
                        <button
                          onClick={() => navigate(`/show-results/${student.id}`)}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "8px 15px",
                            cursor: "pointer",
                          }}
                        >
                          Show Results
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/questionnaire/${student.id}`)}
                          style={{
                            backgroundColor: "#28a745",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "8px 15px",
                            cursor: "pointer",
                          }}
                        >
                          Do Questionnaire
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <p style={styles.noData}>No students found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowStudents;