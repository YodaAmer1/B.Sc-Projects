import React, { useState, useEffect, useContext } from "react";
import { getClassesByTeacherID } from "../services/classHandler";
import { getStudentsByClassID, getQuestionnaireResponses } from "../services/studentHandler";
import { saveGeneratedSeating, fetchExistingSeating } from "../services/seatingHandler";
import { ThemeContext } from "../App";
import ClassroomCSP from '../services/CSP';
import { getApiKey } from '../services/apiService';

const GenerateSeating = ({ teacherId }) => {
 const [classes, setClasses] = useState([]);
 const [students, setStudents] = useState([]);
 const [selectedClass, setSelectedClass] = useState("");
 const [attendance, setAttendance] = useState({});
 const [seatingMatrix, setSeatingMatrix] = useState([]);
 const [loading, setLoading] = useState(false);
 const { theme } = useContext(ThemeContext);
 const [satisfaction, setSatisfaction] = useState(null);
 const [feedbackText, setFeedbackText] = useState('');
 const [apiKey, setApiKey] = useState(null);
 const [error, setError] = useState(null);


 

useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setLoading(true);
        const key = await getApiKey();
        setApiKey(key);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);
 // Fetch teacher-specific classes
 useEffect(() => {
 const fetchClasses = async () => {
 if (!teacherId) return;
 try {
 const classList = await getClassesByTeacherID(teacherId);
 setClasses(classList);
 } catch (err) {
 console.error("Error fetching classes:", err.message);
 }
 };
 fetchClasses();
 }, [teacherId]);

 // Fetch students and existing seating when a class is selected
 useEffect(() => {
 const fetchStudentsAndSeating = async () => {
 if (!selectedClass) {
 setStudents([]);
 setAttendance({});
 setSeatingMatrix([]);
 return;
 }
 try {
 const studentList = await getStudentsByClassID(selectedClass);
 const initialAttendance = {};
 studentList.forEach((student) => (initialAttendance[student.id] = true));
 setStudents(studentList);
 setAttendance(initialAttendance);

 const existingSeating = await fetchExistingSeating(teacherId, selectedClass);
 if (existingSeating && existingSeating.length > 0) {
 setSeatingMatrix(existingSeating);
 } else {
 setSeatingMatrix([]);
 }
 } catch (err) {
 console.error("Error fetching students and seating:", err.message);
 }
 };

 fetchStudentsAndSeating();
 }, [selectedClass, teacherId]);

 const handleAttendanceChange = (studentId) => {
 setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
 };

 const fetchStudentDataWithResponses = async (students) => {
 return Promise.all(
 students.map(async (student) => {
 try {
 const responses = await getQuestionnaireResponses(student.id);
 return { ...student, responses };
 } catch (error) {
 console.error(`Error fetching questionnaire for student ${student.id}:`, error.message);
 return { ...student, responses: null };
 }
 })
 );
 };


 const handleRegenerate = () => {
  
  console.log('Feedback:', feedbackText);
  handleGenerate(feedbackText);
  // Process feedback here
    };


 const generateSeatingArrangement = (students) => {
  return students.map(row => row.map(student => student ? student.name : null));

 };


 const handleGenerate = async (feedback="") => {
 if (!selectedClass) {
 alert("Please select a class before generating the seating arrangement.");
 return;
 }

 setLoading(true);

 try {
 const presentStudents = students.filter((student) => attendance[student.id]);
 const studentData = await fetchStudentDataWithResponses(presentStudents);
 console.log(studentData);

//  const scoredStudents = analyzeStudentScores(studentData);
 
const classroom = new ClassroomCSP(5, 8, studentData,apiKey);
const seating = await classroom.solve(feedback);
console.log("Seating Arrangement:", seating);
 const seatingMatrix = generateSeatingArrangement(seating);

 setSeatingMatrix(seatingMatrix);

 await saveGeneratedSeating(teacherId, selectedClass, seatingMatrix);
 alert("Seating arrangement saved successfully!");


 } catch (error) {
 console.error("Error generating seating arrangement:", error);
 alert("Failed to generate seating arrangement. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 const Styles = {
 pageContainer: {
  
 display: "flex",
 flexDirection: "row",
 minHeight: "95vh",
 backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
 color: theme === "light" ? "#333" : "#f9f9f9",
 boxSizing: "border-box",
 flexWrap: "wrap",
 },
 sidebarSpacing: {
 width: "300px",
 flexShrink: 0,
 "@media (maxWidth: 768px)": {
 display: "none",
 },
 },
 mainContent: {
  
 flex: 1,
 padding: "20px",
 display: "flex",
 flexDirection: "column",
 gap: "20px",
 alignItems: "center",
 justifyContent: "flex-start",
 backgroundColor: theme === "light" ? "#ffffff" : "#1E1E1E",
 borderRadius: "12px",
 boxShadow: theme === "light"
 ? "0 4px 8px rgba(0, 0, 0, 0.1)"
 : "0 4px 8px rgba(0, 0, 0, 0.5)",
 "@media (maxWidth: 768px)": {
 padding: "10px",
 },
 },
 containerStyle: {
  zIndex: 0,
 padding: "20px",
 maxWidth: "800px",
 width: "100%",
 },
 headerStyle: {
 textAlign: "center",
 color: theme === "light" ? "#007bff" : "#90CAF9",
 fontSize: "28px",
 fontWeight: "bold",
 marginBottom: "20px",
 },
 cardContainerStyle: {
 display: "flex",
 gap: "15px",
 flexWrap: "wrap",
 justifyContent: "center",
 },
 classCardStyle: {
 padding: "15px",
 border: "1px solid",
 borderColor: theme === "light" ? "#ddd" : "#444",
 borderRadius: "8px",
 cursor: "pointer",
 width: "150px",
 textAlign: "center",
 backgroundColor: theme === "light" ? "#f9f9f9" : "#2C2C2C",
 color: theme === "light" ? "#333" : "#f9f9f9",
 transition: "background-color 0.3s ease, transform 0.2s ease",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
 },
 attendanceSectionStyle: {
 marginTop: "20px",
 width: "100%",
 },
 attendanceGridStyle: {
 display: "grid",
 gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
 gap: "10px",
 },
 attendanceItemStyle: {
 padding: "10px",
 border: "1px solid",
 borderColor: theme === "light" ? "#ccc" : "#444",
 borderRadius: "8px",
 backgroundColor: theme === "light" ? "#ffffff" : "#2C2C2C",
 color: theme === "light" ? "#333" : "#f9f9f9",
 },
 buttonContainerStyle: {
 textAlign: "center",
 marginTop: "20px",
 },
 buttonStyle: {
 padding: "10px 20px",
 backgroundColor: "green",
 color: "#fff",
 border: "none",
 borderRadius: "8px",
 cursor: "pointer",
 fontSize: "16px",
 transition: "background-color 0.3s ease, transform 0.2s ease",
 },
 matrixContainerStyle: {
 marginTop: "20px",
 backgroundColor: theme === "light" ? "#f9f7f7" : "#1E1E1E",
 padding: "20px",
 borderRadius: "12px",
 boxShadow: theme === "light"
 ? "0 4px 8px rgba(0, 0, 0, 0.1)"
 : "0 4px 8px rgba(0, 0, 0, 0.3)",
 width: "120%",
 display: "flex",
 flexWrap: "wrap",
 gap: "15px",
 marginLeft: "-100px",
 justifyContent: "center",
 },
 seatStyle: {
 display: "flex",
 justifyContent: "center",
 alignItems: "center",
 padding: "10px",
 borderRadius: "20px",
 border: theme === "light" ? "1px solid #ddd" : "1px solid #555",
 backgroundColor: theme === "light" ? "#e3f2fd" : "#37474f",
 color: theme === "light" ? "#333" : "#f9f9f9",
 fontSize: "14px",
 fontWeight: "bold",
 textAlign: "center",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
 transition: "all 0.3s ease",
 cursor: "pointer",
 flex: "0 0 auto",
 minWidth: "80px",
 maxWidth: "150px",
 },
 tableStyle: {
  width: "100%",
  borderCollapse: "separate", // Allows spacing
  borderSpacing: "10px 15px", // Horizontal and vertical spacing between tables
  marginTop: "20px",
  textAlign: "center",
  
},
headerCellStyle: {
  fontWeight: "bold",
  border: "5px solid black",
  padding: "15px",
  backgroundColor: theme === "light" ? "#212020" : "#fff",
  color: theme === "light" ? "#fff" : "#000",
},
cellStyle: {
  textAlign: "center",
  padding: "15px",
  border: "5px solid black" , // Default border for all sides
  borderRight: "none", // Handled conditionally in the render logic
  backgroundColor: theme === "light" ? "#7e93a2" : "#0d2b39",
  color: theme === "light" ? "#000" : "#f9f9f9",
  fontWeight: "bold",
  borderRadius: "0px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
},
emptyCellStyle: {
  backgroundColor: theme === "light" ? "#fff" : "#000",
  color: theme === "light" ? "#aaa" : "#777",
  fontStyle: "italic",
  fontWeight: "normal",
},
feedbackContainer: {
  padding: "24px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  maxWidth: "672px",
  margin: "0 auto"
},

/* Title styles */
feedbackTitle: {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
  color: "#374151"
},

/* Radio group styles */
radioGroup: {
  display: "flex",
  gap: "24px",
  marginBottom: "24px"
},

radioOption: {
  display: "flex",
  alignItems: "center"
},

radioInput: {
  width: "16px",
  height: "16px",
  marginRight: "8px",
  cursor: "pointer"
},

radioLabel: {
  color: "#374151",
  cursor: "pointer"
},

feedbackContainer: {
  padding: "24px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  maxWidth: "672px",
  margin: "0 auto"
},

/* Title styles */
feedbackTitle: {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
  color: "#374151"
},

/* Radio group styles */
radioGroup: {
  display: "flex",
  gap: "24px",
  marginBottom: "24px"
},

radioOption: {
  display: "flex",
  alignItems: "center"
},

radioInput: {
  width: "16px",
  height: "16px",
  marginRight: "8px",
  cursor: "pointer"
},

radioLabel: {
  color: "#374151",
  cursor: "pointer"
},

/* Feedback section styles */
feedbackInputContainer: {
  display: "flex",
  flexDirection: "column",
  gap: "16px"
},

feedbackPrompt: {
  color: "#374151",
  fontWeight: "500"
},

feedbackTextarea: {
  width: "90%",
  height: "25px",
  padding: "16px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontFamily: "inherit",
  fontSize: "14px",
  resize: "none"
},

/* Button styles */
buttonContainer: {
  display: "flex",
  justifyContent: "center",
  marginTop: "24px"
},

regenerateButton: {
  width: "100%",
  height: "40px",
  padding: "12px 24px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  fontSize:"19px",
  borderRadius: "8px",
  fontWeight: "500",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    }


 };
 return (
 <div style={Styles.pageContainer}>
 <div style={Styles.sidebarSpacing}></div>
 <div style={Styles.mainContent}>
 <div style={Styles.containerStyle}>
 <div style={Styles.cardContainerStyle}>
 {classes.map((cls) => (
 <div
 key={cls.id}
 onClick={() => setSelectedClass(cls.id)}
 style={{
 ...Styles.classCardStyle,
 backgroundColor: selectedClass === cls.id ? "#007bff" : "#f9f9f9",
 color: selectedClass === cls.id ? "white" : "black",
 }}
 >
 {cls.name}
 </div>
 ))}
 </div>

 {students.length > 0 && (
 <div style={Styles.attendanceSectionStyle}>
 <h3>Mark Attendance</h3>
 <div style={Styles.attendanceGridStyle}>
 {students.map((student) => (
 <div key={student.id} style={Styles.attendanceItemStyle}>
 <label>
 <input
 type="checkbox"
 checked={attendance[student.id]}
 onChange={() => handleAttendanceChange(student.id)}
 />
 {student.name}
 </label>
 </div>
 ))}
 </div>
 </div>
 )}

 <div style={Styles.buttonContainerStyle}>
 <button onClick={handleGenerate} style={Styles.buttonStyle}>
 Generate Seating
 </button>
 </div>

 {loading ? (
    <div
        style={{
            display: "flex",
            flexDirection: "column", // Stack items vertically
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
        }}
    >
        <img
            src="/Animation.gif"
            alt="Loading..."
            style={{
              marginTop:"700px",
                width: "250px",
                height: "250px",
            }}
        />
        <p
            style={{
                marginTop: "20px", // Add space between the GIF and text
                fontSize: "18px",
                color: theme === "light" ? "#000" : "#fff", 
            }}
        >
            Generating Seating Arrangement...
        </p>
    </div>
) : seatingMatrix.length > 0 ? (
 
  <div style={Styles.matrixContainerStyle}>
  <h3 style={{ marginBottom: "20px" }}>Seating Arrangement</h3>
  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
    <thead>
      <tr>
        <th></th>
        {Array.from({ length: 4 }, (_, index) => (
          <th key={index} colSpan="2" style={Styles.headerCellStyle}>
            Table {index + 1}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
  {seatingMatrix.map((row, rowIndex) => (
    <tr key={rowIndex}>
      <td style={Styles.headerCellStyle}>Row {rowIndex + 1}</td>
      {row.map((studentName, colIndex) => {
        // Determine if this cell is at the start or end of a table group
        const isLeftBorder = colIndex % 2 === 0; // Start of a new group
        const isRightBorder = (colIndex + 1) % 2 === 0; // End of a group
        return (
          <td
            key={colIndex}
            style={{
              ...Styles.cellStyle,
              borderLeft: isLeftBorder ?"5px solid black" : "none",
              borderRight: isRightBorder ? "5px solid black" : "none",
            }}
          >
            {studentName || ""}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>

  </table>
  <div style={Styles.feedbackContainer}>
    <p style={Styles.feedbackTitle}>
        Are you satisfied with the results?
    </p>
    
    <div style={Styles.radioGroup}>
        <div style={Styles.radioOption}>
            <input 
                type="radio" 
                id="satisfied-yes" 
                name="satisfaction" 
                value="yes"
                style={Styles.radioInput}
                onChange={(e) => setSatisfaction(e.target.value)}
            />
            <label style={Styles.radioLabel} htmlFor="satisfied-yes">Yes</label>
        </div>

        <div style={Styles.radioOption}>
            <input 
                type="radio" 
                id="satisfied-no" 
                name="satisfaction" 
                value="no"
                style={Styles.radioInput}
                onChange={(e) => setSatisfaction(e.target.value)}
            />
            <label style={Styles.radioLabel} htmlFor="satisfied-no">No</label>
        </div>
    </div>

    {satisfaction === 'no' && (
        <div style={Styles.feedbackInputContainer}>
            <p style={Styles.feedbackPrompt}>Enter feedback here:</p>
            
    <p style={{ 
        color: "green", 
        fontWeight: "bold", 
        fontSize: "18px" ,
        marginTop: "-10px"
    }}>
        
         *More details mean better results*<br />*your input matters!*
    </p>
            <textarea 
                style={Styles.feedbackTextarea}
                placeholder="Please tell us what could be improved..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div style={Styles.buttonContainer}>
                <button 
                    style={Styles.regenerateButton}
                    onClick={handleRegenerate}>
                    Regenerate
                </button>
            </div>
        </div>
    )}
</div>
</div>


) : (
 <p>No seating arrangement generated yet.</p>
)}

 </div>
 </div>
 </div>
 );
};

export default GenerateSeating;