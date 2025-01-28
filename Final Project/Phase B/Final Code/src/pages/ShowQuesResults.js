import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { getQuestionnaireResponses ,saveQuestionnaireResponse, updateStudentMainInfo} from "../services/studentHandler";





const ShowQuesResults = () => {
  const { theme } = useContext(ThemeContext);
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalResponses, setOriginalResponses] = useState({});


  const questionnaireStructure = {
    "Academic Performance": [
      {
        question: "Rate the student's academic performance in the subject:",
        type: "radio",
        options: [
          "Needs significant support",
          "Below average",
          "Average",
          "Above average",
          "Exceptional",
        ],
      },
      {
        question: "Does the student require additional academic assistance?",
        type: "radio",
        options: ["Yes", "No"],
      },
    ],
    "Behavioral and Social Traits": [
      {
        question: "Rate the student’s behavior in class:",
        type: "radio",
        options: [
          "Disruptive",
          "Occasionally disruptive",
          "Neutral",
          "Positive influence",
          "Exemplary behavior",
        ],
      },
      {
        question:
          "Are there specific students this student should not be seated with? If yes, list names:",
        type: "textarea",
      },
    ],
    "Special Needs": [
      {
        question: "Does the student have any special needs or accommodations?",
        type: "radio",
        options: ["Yes", "No"],
      },
    ],
    "Additional Insights": [
      {
        question:
          "Are there any other notes about the student that could help with seating arrangements?",
        type: "textarea",
      },
    ],
  };
  const mapping={

    "Rate the student's academic performance in the subject:": "Rate performance",
    "Does the student require additional academic assistance?": "Requires assistance?",
    "Rate the student’s behavior in class:": "Behavior rating",
    "Are there specific students this student should not be seated with? If yes, list names:": "Students to avoid",
    "Does the student have any special needs or accommodations?": "Special accommodations",
    "Are there any other notes about the student that could help with seating arrangements?": "Other notes"
  }
  // Fetch Questionnaire Responses from Firestore
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await getQuestionnaireResponses(studentId);


          if (response) {
            setResponses(response); // Save responses to state
            console.log("Questionnaire responses:", response);
            
          } else {
            console.log("No questionnaire responses found.");
          }
        }catch (error) {
        console.error("Error fetching questionnaire responses: ", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchResponses();
  }, [studentId]);


  const handleInputChange = (section, question, value) => {
    setResponses((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: value,
      },
    }));
    console.log(responses);
  };

  const handleSave = async () => {
    try {
      await saveQuestionnaireResponse(studentId, responses);


      await updateStudentMainInfo(studentId, {
        academicLevel: responses["Academic Performance"]["Rate performance"],
        behavior: responses["Behavioral and Social Traits"]["Behavior rating"],
        specialNeeds: responses["Special Needs"]["Special accommodations"],
      });
          alert("Responses saved successfully!");
          navigate("/show-students")
        
      } catch (error) {
      console.error("Error saving responses:", error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
      color: theme === "light" ? "#333" : "#f9f9f9",
      fontFamily: "'Arial', sans-serif",
      flexWrap: "wrap",
    },
    sidebarSpacing: {
      width: "300px",
      flexShrink: 0,
    },
    contentArea: {
      zIndex:0,
      flex: 1,
      marginLeft: "20px",
      padding: "20px",
      background:"transparent",
      borderRadius: "8px",
      boxShadow: theme === "light"
        ? "0 8px 16px rgba(0, 0, 0, 0.2)"
        : "0 8px 16px rgba(0, 0, 0, 0.6)",
        "@media (maxWidth: 768px)": {
    marginLeft: "0", // Remove margin for smaller screens
    padding: "10px", // Reduce padding
  },
    },
    header: {
      textAlign: "center",
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#333",
      padding: "15px 0",
      borderRadius: "8px 8px 0 0",
    },
    headerTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme === "light" ? "#1E88E5" : "#90CAF9",
      margin: 0,
    },
    editButton: {
      padding: "10px 20px",
      backgroundColor: "#E53935",
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "14px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      left: 0,
      transition: "background-color 0.3s ease",
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
    },
    editButtonHover: {
      backgroundColor: "#C62828",
    },
    section: {
      marginBottom: "30px",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: theme === "light" ? "#F9FAFB" : "#2C2C2C",
      boxShadow: theme === "light"
        ? "0 2px 8px rgba(0, 0, 0, 0.1)"
        : "0 2px 8px rgba(0, 0, 0, 0.5)",
      transition: "all 0.3s ease",
      "@media (maxWidth: 768px)": {
        padding: "15px", // Adjust padding for smaller screens
      },
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "20px",
      marginBottom: "10px",
      textAlign: "center",
      textTransform: "uppercase",
    },
    questionBox: {
      marginBottom: "20px",
      padding: "20px",
      border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      borderRadius: "8px",
      backgroundColor: theme === "light" ? "#f4f4f9" : "#2e2e2e",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid",
      borderColor: theme === "light" ? "#DDDDDD" : "#555555",
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2C2C2C",
      color: theme === "light" ? "#333333" : "#F5F5F5",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.3s ease",
      ":focus": {
        borderColor: theme === "light" ? "#1E88E5" : "#90CAF9",
      },
    },
    radioOption: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: theme === "light" ? "#333" : "#f9f9f9",
      "@media (maxWidth: 768px)": {
    fontSize: "12px", 
    gap: "4px", // Reduce spacing
  },
    },
    radioInput: {
      appearance: "none",
      width: "20px",
      height: "20px",
      border: "2px solid",
      borderColor: theme === "light" ? "#333" : "#f9f9f9",
      borderRadius: "50%",
      outline: "none",
      cursor: "pointer",
      backgroundColor: theme === "light" ? "#fff" : "#444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      transition: "all 0.3s ease",
    },
    radioInputChecked: {
      backgroundColor: "#28a745",
      borderColor: "#28a745",
    },
    inputRadioGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginLeft: "20px",
    },
    saveButton: {
      display: "block",
      width: "100%",
      padding: "15px",
      backgroundColor: "#28a745",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      "@media (maxWidth: 768px)": {
    padding: "12px", // Adjust padding
    fontSize: "14px", // Smaller font size
  },
    },
    textarea: {
      width: "100%",
      height: "60px",
      padding: "10px",
      borderRadius: "6px",
      border: theme === "light" ? "1px solid #ccc" : "1px solid #555",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
      color: theme === "light" ? "#333" : "#f9f9f9",
      resize: "none",
    },
    saveButtonHover: {
      backgroundColor: "#2E7D32",
    },
  };



  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;

  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebarSpacing}></div> {/* Sidebar spacing */}
      <div style={styles.contentArea}>
      <div style={styles.header}>
        <button
        style={styles.editButton}
        onClick={() => {
    if (!isEditing) {
      setOriginalResponses(responses); // Save responses before editing
    } else {
      setResponses(originalResponses); // Revert to original responses on Cancel
    }
    setIsEditing((prev) => !prev); // Toggle edit mode
  }}
>
  {isEditing ? "Cancel Edit" : "Edit"}
</button>

      </div>

      {Object.keys(questionnaireStructure).map((section) => (
  <div key={section} style={styles.section}>
    <h2>{section}</h2>
    {questionnaireStructure[section].map(({ question, type, options }) => (
      <div key={question} style={styles.questionBox}>
        <label style={styles.label}>{question}</label>
        {type === "radio" ? (
          options.map((option) => (
            <div key={option} style={styles.radioOption}>
              <input
                type="radio"
                name={`${section}-${question}`}
                value={option}
                checked={responses?.[section]?.[mapping[question]] === option}
                onChange={() =>
                  isEditing && handleInputChange(section, mapping[question], option)
                }
                disabled={!isEditing} // Only editable in edit mode
                style={{
                  appearance: "none", // Remove default styling
                  width: "16px",
                  height: "16px",
                  border: "2px solid #43A047", // Green border
                  borderRadius: "50%",
                  outline: "none",
                  position: "relative",
                  backgroundColor:
                    responses?.[section]?.[mapping[question]] === option
                      ? "#43A047" // Green fill for selected option
                      : "transparent", // Transparent for unselected options
                  cursor: isEditing ? "pointer" : "default",
                }}
              />
              <span style={{ marginLeft: "8px" }}>{option}</span>
            </div>
          ))


        ) : (
          <textarea
            style={styles.input}
            value={responses?.[section]?.[mapping[question]] || ""}
            onChange={(e) =>
              isEditing &&
              handleInputChange(section, mapping[question], e.target.value)
            }
            readOnly={!isEditing}
          />
        )}
      </div>
    ))}
  </div>
))}
      {isEditing && (
        <button style={styles.saveButton} onClick={handleSave}>
          Done
        </button>
      )}
    </div>
    </div>
  );
};

export default ShowQuesResults;