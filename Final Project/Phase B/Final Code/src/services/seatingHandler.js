import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { reconstructMatrix } from "./studentHandler"; // If matrix-related logic is shared

// Save generated seating to Firestore
export const saveGeneratedSeating = async (teacherId, classId, matrix) => {
  try {
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const time = currentDate.toTimeString().split(" ")[0];

    const flattenedMatrix = matrix.flatMap((row, rowIndex) =>
      row.map((student, colIndex) => ({
        row: rowIndex + 1,
        seat: colIndex + 1,
        studentName: student,
      }))
    );

    const seatingDocRef = doc(db, "GeneratedSeating", teacherId, "Classes", classId);

    const seatingDoc = await getDoc(seatingDocRef);
    const existingSeating = seatingDoc.exists()
      ? seatingDoc.data().generatedSeatings || []
      : [];

    const updatedSeating = [
      ...existingSeating,
      { date, time, seatingMatrix: flattenedMatrix },
    ];

    await setDoc(
      seatingDocRef,
      { generatedSeatings: updatedSeating },
      { merge: true }
    );

    console.log("Generated seating saved successfully.");
  } catch (error) {
    console.error("Error saving generated seating:", error.message);
    throw error;
  }
};

export const fetchExistingSeating = async (teacherId, classId) => {
  try {
    const seatingDocRef = doc(db, "GeneratedSeating", teacherId, "Classes", classId);
    const seatingDoc = await getDoc(seatingDocRef);

    if (seatingDoc.exists() && seatingDoc.data().generatedSeatings.length) {
      const latestSeating = seatingDoc.data().generatedSeatings.slice(-1)[0].seatingMatrix;
      return reconstructMatrix(latestSeating); // Ensure it returns the reconstructed matrix
    }
    return []; // Return an empty array if no seating exists
  } catch (error) {
    console.error("Error fetching existing seating:", error.message);
    throw error;
  }
};

