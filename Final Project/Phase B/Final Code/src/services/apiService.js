import { db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';

export const getApiKey = async () => {
  try {
    // Reference to the apiKey document in the config collection
    const apiKeyRef = doc(db, 'config', 'apiKey');
    
    // Fetch the document
    const apiKeyDoc = await getDoc(apiKeyRef);
    
    if (apiKeyDoc.exists()) {
      // Return the apiKey field from the document
      return apiKeyDoc.data().apiKey;
    } else {
      throw new Error('API key document not found in Firestore');
    }
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error;
  }
};

export default {
  getApiKey,
};