import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// Get classes by teacher ID
export const getClassesByTeacherID = async (teacherId) => {
  try {
    const classesQuery = query(
      collection(db, "Classes"),
      where("teacherId", "==", teacherId)
    );
    const snapshot = await getDocs(classesQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching classes by teacher ID:", error.message);
    throw error;
  }
};

// Add a new class
export const addNewClass = async (className, teacherId, teacherName) => {
  if (!className.trim()) {
    throw new Error("Class name cannot be empty");
  }

  const classId = className.replace(/\s+/g, "-").toLowerCase();
  const classRef = doc(db, "Classes", classId);

  try {
    await setDoc(classRef, {
      name: className,
      teacherId: teacherId,
      teacherName: teacherName,
      students: [],
    });

    return { id: classId, name: className, students: [] };
  } catch (error) {
    console.error("Error adding class to Firestore:", error.message);
    throw error;
  }
};
