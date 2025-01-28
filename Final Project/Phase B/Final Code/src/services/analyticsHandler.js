import { getStudentsByClassID,getQuestionnaireResponses  } from "./studentHandler"; // Reuse the existing function
// Fetch Total Students
export const fetchTotalStudents = async (classId) => {
  try {
    const students = await getStudentsByClassID(classId); // Fetch all students by classId
    return students.length; // Return total number of students
  } catch (error) {
    console.error("Error fetching total students:", error.message);
    throw error;
  }
};

// Fetch Special Needs Count
export const fetchSpecialNeedsCount = async (classId) => {
  try {
    const students = await getStudentsByClassID(classId); // Fetch all students by classId
    return students.filter((student) => student.specialNeeds === "Yes").length; // Count students with "Yes" in specialNeeds
  } catch (error) {
    console.error("Error fetching special needs count:", error.message);
    throw error;
  }
};

// Fetch Behavior Counts
export const fetchBehaviorCounts = async (classId) => {
  try {
    const students = await getStudentsByClassID(classId); // Fetch all students by classId
    const behaviorCounts = students.reduce((counts, student) => {
      const behavior = student.behavior || "Unknown";
      counts[behavior] = (counts[behavior] || 0) + 1; // Count occurrences of each behavior type
      return counts;
    }, {});
    return behaviorCounts;
  } catch (error) {
    console.error("Error fetching behavior counts:", error.message);
    throw error;
  }
};

// Fetch Academic Level Distribution
export const fetchAcademicLevelDistribution = async (classId) => {
  try {
    const students = await getStudentsByClassID(classId); // Fetch all students by classId
    const academicLevelCounts = students.reduce((counts, student) => {
      const level = student.academicLevel || "Unknown";
      counts[level] = (counts[level] || 0) + 1; // Count occurrences of each academic level
      return counts;
    }, {});
    return academicLevelCounts;
  } catch (error) {
    console.error("Error fetching academic level distribution:", error.message);
    throw error;
  }
};

// Fetch Assistance Requirement Count
export const fetchAssistanceCount = async (classId) => {
  try {
    // Step 1: Fetch all students in the class
    const students = await getStudentsByClassID(classId);
    if (!students || students.length === 0) return 0;

    let assistanceCount = 0;

    // Step 2: Use existing `getQuestionnaireResponses` to fetch responses for each student
    for (const student of students) {
      const responses = await getQuestionnaireResponses(student.id); // Use existing function
      if (responses?.["Academic Performance"]?.["Requires assistance?"] === "Yes") {
        assistanceCount++;
      }
    }

    return assistanceCount; // Return the count of students requiring assistance
  } catch (error) {
    console.error("Error fetching assistance count:", error.message);
    return 0; // Return 0 if there's an error
  }
};

// Combine All Analytics
export const fetchClassAnalytics = async (classId) => {
  if (!classId) {
    throw new Error("Class ID is required");
  }
  try {
    // Fetch analytics data using the available fields
    const totalStudents = await fetchTotalStudents(classId);
    const specialNeedsCount = await fetchSpecialNeedsCount(classId);
    const behaviorCounts = await fetchBehaviorCounts(classId);
    const academicLevelDistribution = await fetchAcademicLevelDistribution(classId);
    const assistanceCount = await fetchAssistanceCount(classId);

    return {
      totalStudents,
      specialNeedsCount,
      behaviorCounts,
      academicLevelDistribution,
      assistanceCount,
    };
  } catch (error) {
    console.error("Error fetching class analytics:", error.message);
    throw error;
  }
};
