import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App"; 
import { saveQuestionnaireResponse, updateStudentMainInfo } from "../services/studentHandler";



const Questionnaire = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Access dark mode state
  const [responses, setResponses] = useState({});

  const handleInputChange = (section, question, value) => {
    setResponses((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!studentId) {
      alert("Student ID is missing. Please select a student.");
      return;
    }
// Validation: Check if all required questions are filled
if (
  !responses["Academic Performance"]?.["Rate performance"] ||
  !responses["Behavioral and Social Traits"]?.["Behavior rating"] ||
  !responses["Special Needs"]?.["Special accommodations"] ||
  !responses["Academic Performance"]["Requires assistance?"]
) {
  alert("Please fill out all required questions before submitting.");
  return;
}
    try {
      await saveQuestionnaireResponse(studentId, responses);
    await updateStudentMainInfo(studentId, {
      academicLevel: responses["Academic Performance"]["Rate performance"],
      behavior: responses["Behavioral and Social Traits"]["Behavior rating"],
      specialNeeds: responses["Special Needs"]["Special accommodations"],
    });

      alert("Responses saved successfully!");
      navigate("/show-students");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const styles = {
    container: {
      display: "flex", // Ensure the layout accommodates the sidebar
      minHeight: "100vh", // Full height of the page
      backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
      color: theme === "light" ? "#333" : "#f9f9f9",
      fontFamily: "'Arial', sans-serif",
      marginTop:"10px",
      flexWrap: "wrap",
    },
    sidebarSpacing: {
      width: "300px", // Width of the sidebar
      flexShrink: 0, // Prevent sidebar from shrinking
    },
    contentArea: {
      zIndex:0,
      flex: 1, // Allow the content area to take the remaining space
      padding: "20px",
    },
    innerContainer: {
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
      borderRadius: "8px",
      boxShadow: theme === "light" ? "0 8px 16px rgba(0, 0, 0, 0.2)" : "0 8px 16px rgba(0, 0, 0, 0.6)",
      padding: "20px",
      "@media (maxWidth: 768px)": {
    padding: "15px", // Reduce padding
    maxWidth: "100%", // Use full width on mobile
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
      "@media (maxWidth: 768px)": {
    padding: "15px", // Adjust padding
  },
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    inputRadioGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginLeft: "20px",
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
    submitButton: {
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
    fontSize: "14px", // Smaller font for mobile
  },
    },
    radioOption: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: theme === "light" ? "#333" : "#f9f9f9",
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
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.sidebarSpacing}></div> {/* Sidebar Spacing */}
      <div style={styles.contentArea}>
      <div style={styles.innerContainer}>
        <header style={styles.header}>
          
        </header>

        {/* Academic Performance */}
        <section>
          <h2 style={styles.sectionTitle}>Academic Performance</h2>
          <div style={styles.questionBox}>
            <label style={styles.label}>
              Rate the student’s academic performance in the subject: <span style={{ color: "red" ,fontSize:"35px"}}>*</span>
            </label>
            <div style={styles.inputRadioGroup}>
              {["Needs significant support", "Below average", "Average", "Above average", "Exceptional"].map((option) => (
                <div key={option} style={styles.radioOption}>
                <input
                  type="radio"
                  name="academicPerformance"
                  value={option}
                  onChange={(e) =>
                    handleInputChange("Academic Performance", "Rate performance", e.target.value)
                  }
                  style={{
                    ...styles.radioInput,
                    ...(responses?.["Academic Performance"]?.["Rate performance"] === option
                      ? styles.radioInputChecked
                      : {}),
                  }}
                />
                <span>{option}</span>
              </div>

              ))}
            </div>

            <label style={styles.label}>
              Does the student require additional academic assistance? <span style={{ color: "red" ,fontSize:"35px"}}>*</span>
            </label>
            <div style={styles.inputRadioGroup}>
  {["Yes", "No"].map((option) => (
    <div key={option} style={styles.radioOption}>
      <input
        type="radio"
        name="additionalAssistance"
        value={option}
        onChange={(e) =>
          handleInputChange("Academic Performance", "Requires assistance?", e.target.value)
        }
        style={{
          ...styles.radioInput,
          ...(responses?.["Academic Performance"]?.["Requires assistance?"] === option
            ? styles.radioInputChecked
            : {}),
        }}
      />
      <span>{option}</span>
    </div>
  ))}
</div>

          </div>
        </section>

        {/* Behavioral and Social Traits */}
        <section>
          <h2 style={styles.sectionTitle}>Behavioral and Social Traits</h2>
          <div style={styles.questionBox}>
            <label style={styles.label}>Rate the student’s behavior in class:<span style={{ color: "red" ,fontSize:"35px"}}>*</span>
            </label>
            <div style={styles.inputRadioGroup}>
  {["Disruptive", "Occasionally disruptive", "Neutral", "Positive influence", "Exemplary behavior"].map((option) => (
    <div key={option} style={styles.radioOption}>
      <input
        type="radio"
        name="behaviorInClass"
        value={option}
        onChange={(e) =>
          handleInputChange("Behavioral and Social Traits", "Behavior rating", e.target.value)
        }
        style={{
          ...styles.radioInput,
          ...(responses?.["Behavioral and Social Traits"]?.["Behavior rating"] === option
            ? styles.radioInputChecked
            : {}),
        }}
      />
      <span>{option}</span>
    </div>
  ))}
</div>


            <label style={styles.label}>
              Are there specific students this student should not be seated with? If yes, list names:
            </label>
            <textarea
              style={styles.textarea}
              onChange={(e) =>
                handleInputChange("Behavioral and Social Traits", "Students to avoid", e.target.value)
              }
            />
          </div>
        </section>

        {/* Special Needs */}
        <section>
          <h2 style={styles.sectionTitle}>Special Needs</h2>
          <div style={styles.questionBox}>
            <label style={styles.label}>
              Does the student have any special needs or accommodations?<span style={{ color: "red" ,fontSize:"35px"}}>*</span>
            </label>
            <div style={styles.inputRadioGroup}>
  {["Yes", "No"].map((option) => (
    <div key={option} style={styles.radioOption}>
      <input
        type="radio"
        name="specialNeeds"
        value={option}
        onChange={(e) =>
          handleInputChange("Special Needs", "Special accommodations", e.target.value)
        }
        style={{
          ...styles.radioInput,
          ...(responses?.["Special Needs"]?.["Special accommodations"] === option
            ? styles.radioInputChecked
            : {}),
        }}
      />
      <span>{option}</span>
    </div>
  ))}
</div>

          </div>
        </section>

        {/* Additional Insights */}
        <section>
          <h2 style={styles.sectionTitle}>Additional Insights</h2>
          <div style={styles.questionBox}>
            <label style={styles.label}>
              Are there any other notes about the student that could help with seating arrangements?
            </label>
            <textarea
              style={styles.textarea}
              onChange={(e) =>
                handleInputChange("Additional Insights", "Other notes", e.target.value)
              }
            />
          </div>
        </section>

        <button style={styles.submitButton} onClick={handleSubmit}>
          Submit Questionnaire
        </button>
      </div>
    </div>
    </div>
  );
};

export default Questionnaire;