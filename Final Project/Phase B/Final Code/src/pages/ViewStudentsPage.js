import React, { useEffect, useState ,useContext} from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../App"; // Import ThemeContext
import {getStudentsByClassID,updateStudentMainInfo,addStudentToClass,removeStudent} from "../services/studentHandler"
import * as XLSX from "xlsx";



const ViewStudentsPage = ({ teacherName  }) => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    academicLevel: "",
    behavior: "",
    specialNeeds: false,
    language: "",
  });
  const { theme } = useContext(ThemeContext); // Access theme
  const [editingStudent, setEditingStudent] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);



  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const studentsData = await getStudentsByClassID(classId);

        setClassData({
          id: classId, 
          name: `Class ${classId}`, 
          students: studentsData, 
        });
      } catch (err) {
        console.error("Error fetching class data:", err.message);
      }
    };
  
    fetchClassData();
  }, [classId]);

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };
  
  const processUploadedFile = async () => {
    if (!uploadedFile) {
      alert("Please select a file before uploading.");
      return;
    }
  
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const binaryString = event.target.result;
  
        // Use XLSX to parse the file
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        // Skip the header row and map data to student objects
        const rows = data.slice(1);
        const students = rows.map(([name, age, language]) => ({
          id: `${Date.now()}-${Math.random()}`, // Generate unique ID
          name: name?.toString().trim() || "", // Ensure name is a string
          age: parseInt(age, 10), // Parse age as an integer
          language: language?.toString().trim() || "", // Ensure language is a string
          classId, // Associate with the current class
        }));
  
        // Validate and add each student
        for (const student of students) {
          if (!student.name || !student.age || !student.language) {
            alert("Invalid data: Missing required fields (Name, Age, or Language).");
            continue;
          }
  
          await addStudentToClass(student);
          setClassData((prev) => ({
            ...prev,
            students: [...prev.students, student],
          }));
        }
  
        alert("Students added successfully!");
        setUploadedFile(null); // Clear the uploaded file
      };
  
      fileReader.readAsBinaryString(uploadedFile);
    } catch (err) {
      console.error("Error processing file:", err.message);
      alert("An error occurred while uploading students.");
    }
  };
  
  
  
  
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    // Check if the class already has 40 students
    if (classData.students.length >= 40) {
        alert("The class has reached its maximum capacity of 40 students. Cannot add more students.");
       return;
  }
    if (
      !newStudent.name ||
      !newStudent.age ||
      !newStudent.language
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (newStudent.age > 18) {
      alert("Age must be 18 or below. This system is for school students only.");
      return;
    }

    const newStudentObject = {
      ...newStudent,
      id: `${Date.now()}`,
      classId,
    };

    try {
      const studentId = await addStudentToClass(newStudentObject);

      setClassData((prev) => ({
        ...prev,
        students: [...prev.students, { id: studentId, ...newStudentObject }],
      }));

      setNewStudent({
        name: "",
        age: "",
        academicLevel: "",
        behavior: "",
        specialNeeds: false,
        language: "",
      });
      alert("Student added successfully!");
    } catch (err) {
      console.error("Error adding student:", err.message);
    }
  };

  const handleDeleteStudent = async (student) => {
    try {
      // Call the removeStudent function with the student's id
      await removeStudent(student.id);
  
      // Update the local state to reflect the deletion
      setClassData((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== student.id),
      }));
  
      alert("Student deleted successfully!");
    } catch (err) {
      console.error("Error deleting student:", err.message);
      alert("An error occurred while deleting the student.");
    }
  };

  const handleEditStudent = (student) => {
    if (editingStudent && editingStudent.id === student.id) {
      // Cancel editing
      setEditingStudent(null);
      setNewStudent({
        name: "",
        age: "",
        academicLevel: "",
        behavior: "",
        specialNeeds: false,
        language: "",
      });
    } else {
      // Start editing the selected student
      setEditingStudent(student);
      setNewStudent(student);
    }
  };
  

  const handleSaveEdit = async (e) => {
    e.preventDefault();
  
    if (newStudent.age > 18) {
      alert("Age must be 18 or below. This system is for school students only.");
      return;
    }
  
    try {
      await updateStudentMainInfo(editingStudent.id, { ...newStudent });
      setClassData((prev) => ({
        ...prev,
        students: prev.students.map((student) =>
          student.id === editingStudent.id ? { ...newStudent } : student
        ),
      }));
      setEditingStudent(null);
      setNewStudent({
        name: "",
        age: "",
        academicLevel: "",
        behavior: "",
        specialNeeds: false,
        language: "",
      });
      alert("Student updated successfully!");
    } catch (err) {
      console.error("Error updating student:", err.message);
    }
  };
  



  const styles = {
    container: {
      display: "flex",
      minHeight: "50vh",
      flexDirection: "row",
      padding: "20px",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: theme === "light" ? "#333" : "#f9f9f9",
      "@media (maxWidth: 768px)": {
        flexDirection: "column", // Stack the layout vertically for smaller screens
        padding: "10px", // Reduce padding
      },
      
    },
    sidebarSpacing: {
      width: "300px", // Matches sidebar width
      flexShrink: 0,
    },
    mainContent: {
      zIndex: 0,
      flex: 1,
      maxWidth: "700px",
      margin: "0 auto",
      padding: "20px",
      
      background: "transparent",
      borderRadius: "12px",
      
        "@media (maxWidth: 768px)": {
  maxWidth: "100%", // Make it full-width
  margin: "0", // Remove auto margins
  padding: "10px", // Reduce padding for smaller screens
},
    },
    header: {
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      color: theme === "light" ? "#1E88E5" : "#90CAF9",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#2E3B4E",
      border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      boxShadow: theme === "light"
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    tableWrapper: {
      maxHeight: "400px", // Set the desired max height
      overflowY: "auto", // Enable vertical scrolling
      marginTop: "20px",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#2E3B4E",
      borderRadius: "8px",
      border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      boxShadow: theme === "light"
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "0 2px 4px rgba(0, 0, 0, 0.3)",
      padding: "10px", // Optional padding for aesthetics
      overflowX: "auto", // Horizontal scroll for small screens
"@media (maxWidth: 768px)": {
  padding: "5px", // Smaller padding for mobile
},
    },
    th: {
      padding: "12px",
      backgroundColor: theme === "light" ? "#4CAF50" : "#3C4049",
      color: "#fff",
      textAlign: "left",
      fontWeight: "bold",
      textTransform: "uppercase",
      "@media (maxWidth: 768px)": { 
        fontSize: "12px", // Smaller font for mobile
        padding: "8px", // Adjust padding for mobile
      },
    },
    td: {
      padding: "10px",
      color: theme === "light" ? "#333" : "#ddd",
      borderBottom: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      transition: "background-color 0.3s ease-in-out",
      "@media (maxWidth: 768px)": { 
        fontSize: "12px", // Smaller font for mobile
        padding: "8px", // Adjust padding for mobile
      },
    },
    tableRowHover: {
      backgroundColor: theme === "light" ? "#F8F9FA" : "#2D3748",
    },
    editButton: {
      marginRight: "10px",
      padding: "8px 16px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      boxShadow: theme === "light"
        ? "0 2px 4px rgba(0, 0, 0, 0.2)"
        : "0 2px 4px rgba(0, 0, 0, 0.5)",
      transition: "background-color 0.3s ease",
    },
    deleteButton: {
      padding: "8px 10px",
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      boxShadow: theme === "light"
        ? "0 2px 4px rgba(0, 0, 0, 0.2)"
        : "0 2px 4px rgba(0, 0, 0, 0.5)",
      transition: "background-color 0.3s ease",
    },
    formContainer: {
      marginTop: "100px",
      padding: "25px",
      width:"60%",
      marginLeft:"140px",
      borderRadius: "12px",
      backgroundColor: theme === "light" ? "#ffffff" : "#2E3B4E",
      boxShadow: theme === "light"
        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
        : "0 4px 8px rgba(0, 0, 0, 0.5)",
        "@media (maxWidth: 768px)": {
  width: "100%", // Full-width for mobile
  marginLeft: "0", // Remove left margin
  padding: "10px", // Reduce padding
},
    },
    formHeader: {
      marginBottom: "15px",
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "center",
      color: theme === "light" ? "#1E88E5" : "#90CAF9",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: theme === "light" ? "1px solid #ccc" : "1px solid #555",
      fontSize: "14px",
      backgroundColor: theme === "light" ? "#F5F5F5" : "#1E1E1E",
      color: theme === "light" ? "#333" : "#f9f9f9",
      marginBottom: "10px",
      outline: "none",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      color: theme === "light" ? "#333" : "#f9f9f9",
    },
    checkbox: {
      transform: "scale(1.2)",
      cursor: "pointer",
    },
    submitButton: {
      padding: "12px 20px",
      backgroundColor: "#2196F3",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      boxShadow: theme === "light"
        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
        : "0 4px 8px rgba(0, 0, 0, 0.5)",
      transition: "background-color 0.3s ease",
    },
    submitButtonHover: {
      backgroundColor: "#1769aa",
    },
    
  };




  return (
    <div style={styles.container}>
      <div style={styles.sidebarSpacing}></div>
      <div style={styles.mainContent}>
      {classData ? (
        <>
          <h2 style={styles.header}>
            {classData.name} - {classData.students?.length || 0} Students
          </h2>
          {classData.students && classData.students.length > 0 ? (
            <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Academic Level</th>
                  <th style={styles.th}>Behavior</th>
                  <th style={styles.th}>Language</th>
                  <th style={styles.th}>Special Needs</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classData.students.map((student) => (
                  <tr key={student.id}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.age}</td>
                    <td style={styles.td}>{student.academicLevel}</td>
                    <td style={styles.td}>{student.behavior}</td>
                    <td style={styles.td}>{student.language}</td>
                    <td style={styles.td}>
                      {student.specialNeeds ? "Yes" : "No"}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEditStudent(student)}
                        style={styles.editButton}
                      >
                        {editingStudent && editingStudent.id === student.id ? "Cancel Edit" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p>No students found in this class.</p>
          )}
          <div style={styles.formContainer}>
            <h3 style={styles.formHeader}>
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h3>
            <form
              onSubmit={editingStudent ? handleSaveEdit : handleAddStudent}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newStudent.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={newStudent.age}
                onChange={handleChange}
                required
                min="5"
                max="18"
                style={styles.input}
              />
              
              <input
                type="text"
                name="language"
                placeholder="Language"
                value={newStudent.language}
                onChange={handleChange}
                required
                style={styles.input}
              />
              
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  backgroundColor: editingStudent ? "#4CAF50" : "#2196F3",
                }}
              >
                {editingStudent ? "Save Changes" : "Add Student"}
              </button>
              
            </form>
          </div>
          <div style={styles.formContainer}>
          
  <h3 style={styles.formHeader}>Upload Students</h3>
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {/* Question Mark with Tooltip */}
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          marginTop:"10px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: theme === "light"
            ? "0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.5)",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        ?
      </div>
      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "120%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: theme === "light" ? "#f9f9f9" : "#333",
            color: theme === "light" ? "#333" : "#f9f9f9",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: theme === "light"
              ? "0 2px 8px rgba(0, 0, 0, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.5)",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          Please upload a file in <strong>.csv</strong> or <strong>.xlsx</strong> format.<br />
    The file should include the following columns:<br />
    <em>Name, Age, and Language</em>.
        </div>
      )}
    </div>

    {/* Hidden File Input */}
    <input
      type="file"
      accept=".csv, .xlsx"
      id="fileUpload"
      onChange={(e) => handleFileUpload(e)}
      style={{ display: "none" }} // Hide the default file input
    />
    {/* Custom File Input Label */}
    <label
      htmlFor="fileUpload"
      style={{
        marginTop: "10px",
        padding: "8px 17px",
        backgroundColor: "#fff",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        boxShadow: theme === "light"
          ? "0 4px 8px rgba(0, 0, 0, 0.1)"
          : "0 4px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      Choose File
    </label>
    {/* Display Selected File Name */}
    <span
      style={{
        fontSize: "18px",
        color: uploadedFile ? "green" : "red", // Green if file is selected, red if not
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {uploadedFile ? uploadedFile.name : "No File Selected"}
    </span>
  </div>
  <button
    onClick={processUploadedFile}
    style={{
      ...styles.submitButton,
      backgroundColor: "green",
      marginTop: "30px",
      width: "100%",
    }}
  >
    Upload and Add Students
  </button>
</div>


        </>
      ) : (
        <p>Loading class data...</p>
      )}
    </div>
    </div>
  );

};

export default ViewStudentsPage;