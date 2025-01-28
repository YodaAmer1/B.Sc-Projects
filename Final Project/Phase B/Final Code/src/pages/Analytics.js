import React, { useState, useEffect, useContext } from "react";
import { getClassesByTeacherID } from "../services/classHandler";
import { fetchClassAnalytics } from "../services/analyticsHandler";
import { getCurrentUser } from "../services/authHandler";
import { ThemeContext } from "../App";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = ({ teacherId }) => {
  const { theme } = useContext(ThemeContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const generateChartOptionsForCircle = (theme) => ({
    plugins: {
      legend: {
        display: true,
        labels: {
          color: theme === "light" ? "#333" : "#f9f9f9", // Set the text color for the legend
          font: {
            size: 14, // Ensure readability
          },
          boxWidth: 25, // Optional: Size of the color box next to the legend labels
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Tooltip customization
          },
        },
        titleColor: theme === "light" ? "#333" : "#f9f9f9", // Tooltip title color
        bodyColor: theme === "light" ? "#333" : "#f9f9f9", // Tooltip body color
        backgroundColor: theme === "light" ? "#fff" : "#333", // Tooltip background color
      },
    },
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
      },
    },
  });
  
  const generateChartOptions = (theme) => ({
    plugins: {
      legend: {
        display: true,
        labels: {
          color: theme === "light" ? "#333" : "#f9f9f9", // Adjust legend text color for theme
          usePointStyle: true, // Removes the box
          pointStyle: "line", // Minimal line style
          font: {
            size: 16, // Increase this value for larger legend labels
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: theme === "light" ? "#333" : "#f9f9f9", // X-axis text color
        },
        grid: {
          display: true,
          color: theme === "light" ? "#ddd" : "#444", // X-axis grid lines color
        },
        border: {
          color: theme === "light" ? "#333" : "#f9f9f9", // X-axis border (line) color
        },
      },
      y: {
        ticks: {
          color: theme === "light" ? "#333" : "#f9f9f9", // Y-axis text color
          
        },
        grid: {
          display: true,
          color: theme === "light" ? "#ddd" : "#444", // Y-axis grid lines color
        },
        border: {
          color: theme === "light" ? "#333" : "#f9f9f9", // Y-axis border (line) color
        },
      },
    },
  });
  const calculateAverageAcademicLevel = (academicLevelDistribution) => {
    const levelMapping = {
      "Needs significant support": 1,
      "Below average": 2,
      "Average": 3,
      "Above average": 4,
      "Exceptional": 5,
    };
  
    let totalValue = 0;
    let totalCount = 0;
  
    // Accumulate total value and count
    Object.keys(levelMapping).forEach((level) => {
      const count = academicLevelDistribution[level] || 0; // Default to 0 if level is missing
      totalValue += levelMapping[level] * count;
      totalCount += count;
    });
  
    if (totalCount === 0) {
      return "No Data"; // Handle empty distributions
    }
  
    const averageValue = totalValue / totalCount;
  
    // Correct rounding logic: floor for x.1-x.49, ceil for x.50-x.99
    const roundedAverage =
      averageValue - Math.floor(averageValue) < 0.5
        ? Math.floor(averageValue)
        : Math.ceil(averageValue);
  
    // Map back to academic levels
    const reversedMapping = Object.entries(levelMapping).reduce(
      (acc, [key, value]) => ({ ...acc, [value]: key }),
      {}
    );
  
    return reversedMapping[roundedAverage] || "No Data";
  };
  
  
  
  // Fetch the teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const currentUser = getCurrentUser();
        const teacherId = currentUser?.uid;
        const classList = await getClassesByTeacherID(teacherId);
        setClasses(classList);
      } catch (err) {
        console.error("Error fetching classes:", err.message);
        setError("Failed to fetch classes. Please try again later.");
      }
    };
    fetchClasses();
  }, [teacherId]);

  // Fetch analytics data for the selected class
  const handleClassSelection = async (classId) => {
    setSelectedClass(classId);
    setLoading(true);
    setAnalyticsData(null);
    setError("");

    try {
      const data = await fetchClassAnalytics(classId);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching analytics data:", err.message);
      setError("Failed to fetch analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getBehaviorChartData = () => ({
    labels: [
      ["Disruptive"],
    ["Occasionally", "disruptive"],
    ["Neutral"],
    ["Positive", "influence"],
    ["Exemplary", "behavior"],
    ],
    datasets: [
      {
        label: "Behavior Distribution",
        data: [
          analyticsData.behaviorCounts["Disruptive"] || 0,
          analyticsData.behaviorCounts["Occasionally disruptive"] || 0,
          analyticsData.behaviorCounts["Neutral"] || 0,
          analyticsData.behaviorCounts["Positive influence"] || 0,
          analyticsData.behaviorCounts["Exemplary behavior"] || 0,
        ],
        backgroundColor: [
          "#b71c1c", // Dark Red for Severely Disruptive
          "#f44336", // Red for Occasionally Disruptive
          "#ff9800", // Orange for Neutral
          "#4caf50", // Green for Positive Influence
          "limegreen", // Blue for Exemplary Behavior
        ],
      },
    ],
  });
  
  const getAcademicLevelChartData = () => ({
    labels: [
      ["Needs significant" ,"support"],
      "Below average",
      "Average",
      "Above average",
      "Exceptional",
    ],
    datasets: [
      {
        label: "Academic Level Distribution",
        data: [
          analyticsData.academicLevelDistribution["Needs significant support"] || 0,
          analyticsData.academicLevelDistribution["Below average"] || 0,
          analyticsData.academicLevelDistribution["Average"] || 0,
          analyticsData.academicLevelDistribution["Above average"] || 0,
          analyticsData.academicLevelDistribution["Exceptional"] || 0,
        ],
        backgroundColor: [
          "#b71c1c", // Dark Red for Failing
          "#f44336", // Red for Below Average
          "#ff9800", // Orange for Average
          "#4caf50", // Green for Above Average
          "limegreen", // Blue for Exceptional
        ],
      },
    ],
  });

  const getSpecialNeedsChartData = () => ({
    labels: ["Special Needs", "Non-Special Needs"],
    datasets: [
      {
        data: [analyticsData.specialNeedsCount, analyticsData.totalStudents - analyticsData.specialNeedsCount],
        backgroundColor: theme === "light" ? ["#03a9f4", "limeGreen"] : ["#0288d1", "green"],
      },
    ],
  });

  
  const getAssistanceChartData = () => ({
    labels: ["Requires Assistance", "No Assistance Needed"],
    datasets: [
      {
        data: [
          analyticsData.assistanceCount,
          analyticsData.totalStudents - analyticsData.assistanceCount,
        ],
        backgroundColor: theme === "light" ? ["#F0AA1E", "#0000A0"] : ["orange", "darkblue"],
      },
    ],
  });

  const styles = {
    pageContainer: {
      flex: 1,
      padding: "20px",
      margin: "0 auto",
      maxWidth: "1100px",
      position: "relative",
      zIndex: 0,
      background: "transparent",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      
    },
    sidebarSpacing: {
      width: "300px", // Matches the actual sidebar width
      flexShrink: 0, // Prevents shrinking when the page is resized
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      background: theme === "light" ? "#f9f9f9" : "#121212",
      color: theme === "light" ? "#333" : "#f9f9f9",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      color: theme === "light" ? "#007bff" : "#90caf9",
    },
    dropdown: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid",
      borderColor: theme === "light" ? "#ddd" : "#444",
      backgroundColor: theme === "light" ? "#fff" : "#2c2c2c",
      color: theme === "light" ? "#333" : "#f9f9f9",
      marginBottom: "20px",
    },
    statsContainer: {
      display: "flex",
      flexDirection: "row", // Keep cards in a row
      justifyContent: "center", // Center horizontally
      alignItems: "center", // Center vertically (optional if required)
      gap: "20px", // Space between cards
      marginBottom: "50px",
    },
    statCard: {
      padding: "20px",
      borderRadius: "8px",
      boxShadow: theme === "light" ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "0 4px 8px rgba(0, 0, 0, 0.5)",
      backgroundColor: theme === "light" ? "#fff" : "#2c2c2c",
      textAlign: "center",
    },
    chartContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    chart: {
      flex: "1 1 45%",
      minWidth: "300px",
    },
    spinnerOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background:"transparent",
      
    },
    
    spinner: {
      width: "80px",
      height: "80px",
      border: "8px solid rgba(200, 200, 200, 0.2)", // Light gray border
      borderTop: "8px solid #007bff", // Blue border for animation
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    
    spinnerText: {
      marginTop: "20px",
      fontSize: "18px",
      fontWeight: "bold",
      color: theme === "light" ? "#333" : "#f9f9f9",
    },
  };

  return (
    <div style={styles.contentWrapper}>
      <div style={styles.sidebarSpacing}></div> {/* Sidebar spacing */} 
      <div style={styles.pageContainer}>
        
  
        <select
          style={styles.dropdown}
          value={selectedClass}
          onChange={(e) => handleClassSelection(e.target.value)}
        >
          <option value="">Select a Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
  
        {loading && (
  <div
    style={{
      display: "flex",
      flexDirection: "column", // Stack items vertically
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "transparent", 
      zIndex: 1000,
    }}
  >
    <img
      src="/Animation2.gif" 
      alt="Loading..."
      style={{
        marginLeft:"200px",
        marginTop:"250px",
        width: "200px", 
        height: "200px",
      }}
    />
    <p
      style={{
        marginLeft:"200px",
        marginTop: "20px", // Spacing between GIF and text
        fontSize: "18px",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Loading Analytics...
    </p>
  </div>
)}
            <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
        {error && <p style={{ color: "red" }}>{error}</p>}
  
        {analyticsData && (
          <>
            <div style={styles.statsContainer}>
            <div style={styles.statCard}>
            <h3>Academic Performance Average</h3>
            <p
             style={{
               color: {
                  "Needs significant support": "#b71c1c", // Red for worst
                  "Below average": "#f44336", // Orange
                  "Average": "#ff9800", // Blue
                  "Above average": "#4caf50", // Green
                  "Exceptional": "limegreen", // Light blue for best
                 }[calculateAverageAcademicLevel(analyticsData.academicLevelDistribution)],
                fontSize: 25,
                }}
              >
               {calculateAverageAcademicLevel(analyticsData.academicLevelDistribution)}
           </p>
          </div>
              <div style={styles.statCard}>
                <h3>Behavioral Issues Students</h3>
                <p style={{ color: "red" ,fontSize:25}}>
                {analyticsData.behaviorCounts["Occasionally disruptive"] || 0}</p>
              </div>
              <div style={styles.statCard}>
                <h3>Positive Behavior Students</h3>
                <p style={{ color: "limegreen" ,fontSize:25}}>
                  {analyticsData.behaviorCounts["Exemplary behavior"] || 0}</p>
              </div >
              <div style={styles.statCard}>
                <h3>Students Requires Assistance</h3>
                <p style={{ color: "Orange" ,fontSize:25}}>
                  {analyticsData.assistanceCount}</p>
              </div>
              <div style={styles.statCard}>
                <h3>Total Students</h3>
                <p style={{ fontSize:25}}>
                  {analyticsData.totalStudents}</p>
              </div>
            </div>
  
            <div style={styles.chartContainer}>
              <div style={styles.chart}>
              <Bar data={getBehaviorChartData()} options={generateChartOptions(theme)} />
              </div>
              <div style={{ width: "450px", height: "450px" }}>
              <Pie data={getSpecialNeedsChartData()} options={generateChartOptionsForCircle(theme)} />
              </div>
              <div style={styles.chart}>
              <Bar data={getAcademicLevelChartData()} options={generateChartOptions(theme)} />
              </div>
              <div style={{ width: "450px", height: "450px" }}>
              <Pie data={getAssistanceChartData()} options={generateChartOptionsForCircle(theme)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
