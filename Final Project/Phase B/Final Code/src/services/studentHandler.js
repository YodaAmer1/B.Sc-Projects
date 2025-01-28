import { collection, query, where, getDocs,addDoc, doc, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

// Get students by class ID
export const getStudentsByClassID = async (classId) => {
  try {
    const studentsQuery = query(collection(db, "Students"), where("classId", "==", classId));
    const snapshot = await getDocs(studentsQuery);

    const studentList = await Promise.all(
      snapshot.docs.map(async (studentDoc) => {
        const questionnaireRef = doc(studentDoc.ref, "Questionnaire", "Responses");
        const questionnaireDoc = await getDoc(questionnaireRef);

        return {
          id: studentDoc.id,                // Student ID
          ...studentDoc.data(),             // Student data
          hasSubmitted: questionnaireDoc.exists(), // Check if the questionnaire is submitted
        };
      })
    );

    return studentList;
  } catch (error) {
    console.error("Error fetching students by class ID:", error.message);
    throw error;
  }
};

// Get student by ID
export const getStudentById = async (studentId) => {
  try {
    const studentQuery = query(collection(db, "Students"), where("id", "==", studentId));
    const querySnapshot = await getDocs(studentQuery);
    if (querySnapshot.empty) {
      throw new Error("Student document not found.");
    }
    return querySnapshot.docs[0]; // Return the first matching document
  } catch (error) {
    console.error("Error fetching student by ID:", error.message);
    throw error;
  }
};

// Save questionnaire response
export const saveQuestionnaireResponse = async (studentId, responses) => {
  try {
    // Query to find the student document
    const studentQuery = query(collection(db, "Students"), where("id", "==", studentId));
    const querySnapshot = await getDocs(studentQuery);

    if (querySnapshot.empty) {
      throw new Error("Student document not found.");
    }

    // Save responses to the Questionnaire subcollection
    for (const studentDoc of querySnapshot.docs) {
      const studentRef = doc(db, "Students", studentDoc.id, "Questionnaire", "Responses");
      await setDoc(studentRef, { ...responses });
    }

    console.log("Questionnaire responses saved successfully.");
  } catch (error) {
    console.error("Error saving questionnaire responses:", error.message);
    throw error;
  }
};


// Update student main info
export const updateStudentMainInfo = async (studentId, updateFields) => {
  try {
    const studentQuery = query(collection(db, "Students"), where("id", "==", studentId));
    const querySnapshot = await getDocs(studentQuery);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (docSnapshot) => {
        const studentRef = doc(db, "Students", docSnapshot.id);
        await updateDoc(studentRef, { ...updateFields });
      });
    } else {
      throw new Error("Student document not found.");
    }
  } catch (error) {
    console.error("Error updating student main info:", error.message);
    throw error;
  }
};

// Remove a student
export const removeStudent = async (studentId) => {
  try {
    const studentDoc = doc(db, "Students", studentId); // Replace with your collection path
    await deleteDoc(studentDoc);
  } catch (err) {
    console.error("Error deleting student:", err.message);
    throw err;
  }
};

// Get questionnaire responses
export const getQuestionnaireResponses = async (studentId) => {
  try {
    const studentQuery = query(collection(db, "Students"), where("id", "==", studentId));
    const querySnapshot = await getDocs(studentQuery);

    for (const studentDoc of querySnapshot.docs) {
      const studentRef = doc(db, "Students", studentDoc.id, "Questionnaire", "Responses");
      const docSnap = await getDoc(studentRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching questionnaire responses:", error);
    throw error;
  }
};

export const addStudentToClass = async (studentData) => {
  const studentRef = await addDoc(collection(db, "Students"), studentData);
  return studentRef.id;
};
// Reconstruct seating matrix
export const reconstructMatrix = (flattenedMatrix) => {
  const matrix = [];
  flattenedMatrix.forEach((seat) => {
    const { row, studentName } = seat;
    if (!matrix[row - 1]) matrix[row - 1] = [];
    matrix[row - 1].push(studentName);
  });
  return matrix;
};
