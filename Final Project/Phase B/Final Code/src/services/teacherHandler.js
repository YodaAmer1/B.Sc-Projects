import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Get all teachers
export const getAllTeachers = async () => {
  try {
    const teachersCollection = collection(db, "Teachers");
    const snapshot = await getDocs(teachersCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all teachers:", error.message);
    throw error;
  }
};

// Get teacher by ID
export const getTeacherById = async (teacherId) => {
  try {
    const teacherRef = doc(db, "Teachers", teacherId);
    const teacherDoc = await getDoc(teacherRef);
    if (!teacherDoc.exists()) {
      throw new Error("Teacher not found.");
    }
    return teacherDoc;
  } catch (error) {
    console.error("Error fetching teacher by ID:", error.message);
    throw error;
  }
};

// Add a new teacher
export const addTeacher = async (teacherId, teacherData) => {
  try {
    const teacherRef = doc(db, "Teachers", teacherId);
    await setDoc(teacherRef, teacherData);
    console.log("Teacher added successfully.");
  } catch (error) {
    console.error("Error adding teacher:", error.message);
    throw error;
  }
};
