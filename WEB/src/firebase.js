import { updateProfile, updatePassword } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Timestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDj5lHl9qwaIhVVxKFyK-m-ENvw8bKvlk",
  authDomain: "cryptopulse-e45b9.firebaseapp.com",
  projectId: "cryptopulse-e45b9",
  storageBucket: "cryptopulse-e45b9.appspot.com",
  messagingSenderId: "308291913891",
  appId: "1:308291913891:web:fa95a3feb4999f921c5716",
  measurementId: "G-FGVTZMFMSL",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export the Firebase services that you want to use in your app
export const auth = app.auth();
export default app;

// Fetch cryptocurrency data from Firestore
export async function fetchCryptoCurrenciesFromFirestore() {
  const db = firebase.firestore(); // Initialize Firestore database reference
  try {
    const snapshot = await db.collection("cryptocurrencies").get();
    const returnData = {}; // Object to store the return data
    const currencies = []; // Array to store the currency data
    // Loop through the snapshot and add the data to the currencies array
    snapshot.forEach((doc) => {
      if (doc.id !== "updatedTimeStamp")
        currencies.push(doc.data()); // Add the data to the currencies array
      else returnData.updatedTime = doc.data().timeStamp; // Store the updated timestamp
    });

    returnData.currencies = currencies; // Add the currencies array to the return data

    return returnData;
  } catch (error) {
    console.error("Error fetching cryptocurrency data from Firestore:", error);
  }
}

// Fetch cryptocurrency news data from Firestore
export async function fetchCryptoNewsFromFirestore() {
  const db = firebase.firestore(); // Initialize Firestore database reference
  try {
    const snapshot = await db.collection("cryptonews").get();
    const returnData = {}; // Object to store the return data
    const news = []; // Array to store the news data
    // Loop through the snapshot and add the data to the news array
    snapshot.forEach((doc) => {
      if (doc.id !== "updatedTimeStamp")
        news.push(doc.data()); // Add the data to the news array
      else returnData.updatedTime = doc.data().timeStamp; // Store the updated timestamp
    });

    returnData.news = news; // Add the news array to the return data

    return returnData;
  } catch (error) {
    console.error("Error fetching crypto news data from Firestore:", error);
  }
}

// Create a new user account with email and password
export async function createNewUser(user, formData) {
  const db = firebase.firestore(); // Initialize Firestore database reference
  try {
    // Create a new user document in Firestore
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      phone: formData.phone,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating new user in Firestore:", error);
  }
}

// Fetch user data from Firestore
export async function fetchUserDataFromFirestore(user) {
  const db = firebase.firestore(); // Initialize Firestore database reference

  try {
    // Fetch the main user document
    const userDocRef = db.collection("users").doc(user.uid); // Reference to the user document
    const userSnapshot = await userDocRef.get(); // Fetch the user document
    const userData = userSnapshot.data() || {}; // Extract the user data

    // Assuming the names of the subcollections are 'wallet' and 'transactions'
    // Fetch data from the 'wallet' subcollection
    const walletCollectionRef = userDocRef.collection("wallet"); // Reference to the 'wallet' subcollection
    const walletSnapshot = await walletCollectionRef.get(); // Fetch the 'wallet' subcollection
    const walletData = walletSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch data from the 'transactions' subcollection
    const transactionsCollectionRef = userDocRef.collection("transactions"); // Reference to the 'transactions' subcollection
    const transactionsSnapshot = await transactionsCollectionRef.get(); // Fetch the 'transactions' subcollection
    const transactionsData = transactionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Combine user data with subcollections data
    const combinedData = {
      ...userData,
      wallet: walletData,
      transactions: transactionsData,
    };

    return combinedData;
  } catch (error) {
    console.error(
      "Error fetching user data and collections from Firestore:",
      error,
    );
    return null; // Or handle the error as appropriate for your application
  }
}

// Add cryptocurrency to the user's wallet
export async function addCryptoToTheWallet(
  user, // Firebase user object
  currency, // Currency object
  amount, // Amount to add
  price, // Current price of the currency
  creditCardDetails, // Credit card details
  accountBalance, // Account balance
) {
  const db = firebase.firestore(); // Initialize Firestore database reference
  const userWalletRef = db // Reference to the user's wallet document
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(currency.id);

  const userTransactionsRef = db // Reference to the user's transactions document
    .collection("users")
    .doc(user.uid)
    .collection("transactions")
    .doc(); // Generates a new document reference for a transaction

  try {
    // Run a transaction to add the currency to the user's wallet
    await db.runTransaction(async (transaction) => {
      const walletDoc = await transaction.get(userWalletRef); // Retrieve the wallet document

      // Retrieve the current amount from the document
      const currentAmount = walletDoc.data() ? walletDoc.data().amount : 0;

      // Calculate the new amount
      const newAmount = currentAmount + amount;

      // Update the document with the new amount
      if (walletDoc.exists) {
        transaction.update(userWalletRef, { amount: newAmount }); // Update the document with the new amount
      } else {
        transaction.set(userWalletRef, { id: currency.id, amount: newAmount }); // Create a new document with the new amount
      }

      // Save only the last 4 digits of the credit card number
      const creditCardDetailsToSave = {
        cardNumber:
          "**** **** **** " + creditCardDetails.cardNumber.slice(15, 19),
        cardName: creditCardDetails.cardName,
        expDate: creditCardDetails.expDate,
        ccv: creditCardDetails.ccv,
      };

      // Add a new transaction record
      transaction.set(userTransactionsRef, {
        accountBalance: accountBalance,
        currencyId: currency.id,
        transactionType: "buy",
        amount: amount,
        price: price,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Stores the time the transaction was made
        creditCardDetails: creditCardDetailsToSave,
      });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.log("Transaction failed: ", error);
  }
}

//Trade cryptocurrency in the user's wallet
export async function tradeCrypto(
  user, // Firebase user object
  soldCurrency, // Currency object to sell
  boughtCurrency, // Currency object to buy
  soldCurrencyAmount, // Amount of currency to sell
  boughtCurrencyAmount, // Amount of currency to buy
) {
  const db = firebase.firestore(); // Initialize Firestore database reference

  const boughtCurrenceyRef = db // Reference to the bought currency document
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(boughtCurrency.id);

  const soldCurrenceyRef = db // Reference to the sold currency document
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(soldCurrency.id);

  const userTransactionsRef = db // Reference to the user's transactions document
    .collection("users")
    .doc(user.uid)
    .collection("transactions")
    .doc(); // Generates a new document reference for a transaction

  try {
    // Run a transaction to trade the currencies
    await db.runTransaction(async (transaction) => {
      const soldCurrenceyDoc = await transaction.get(soldCurrenceyRef); // Retrieve the sold currency document
      const boughtCurrenceyDoc = await transaction.get(boughtCurrenceyRef); // Retrieve the bought currency document

      // Retrieve the current amount from the document
      const currentSoldAmount = soldCurrenceyDoc.data()
        ? soldCurrenceyDoc.data().amount
        : 0;
      // Retrieve the current amount from the document
      const currentBoughtAmount = boughtCurrenceyDoc.data()
        ? boughtCurrenceyDoc.data().amount
        : 0;

      if (currentSoldAmount < soldCurrencyAmount) {
        console.log("Insufficient funds!");
        return "Error: Insufficient funds!";
      }

      // Calculate the new amount
      const newSoldCurrenceyAmount = currentSoldAmount - soldCurrencyAmount;
      const newBoughtCurrenceyAmount =
        currentBoughtAmount + boughtCurrencyAmount;

      transaction.update(soldCurrenceyRef, { amount: newSoldCurrenceyAmount });

      // Update the document with the new amount
      if (boughtCurrenceyDoc.exists) {
        transaction.update(boughtCurrenceyRef, {
          amount: newBoughtCurrenceyAmount,
        }); // Update the document with the new amount
      } else {
        transaction.set(boughtCurrenceyRef, {
          id: boughtCurrency.id,
          amount: newBoughtCurrenceyAmount,
        }); // Create a new document with the new amount
      }

      // Add a new transaction record
      transaction.set(userTransactionsRef, {
        soldCurrency: {
          id: soldCurrency.id,
          amount: soldCurrencyAmount,
        },
        boughtCurrency: {
          id: boughtCurrency.id,
          amount: boughtCurrencyAmount,
        },
        transactionType: "trade",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Stores the time the transaction was made
      });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.log("Transaction failed: ", error);
  }
}

// Withdraw cryptocurrency from the user's wallet
export async function withdrawCrypto(
  user, // Firebase user object
  currency, // Currency object
  amount, // Amount to withdraw
  bankAccountDetails, // Bank account details
  accountBalance, // Account balance
) {
  const db = firebase.firestore(); // Initialize Firestore database reference

  const currenceyRef = db // Reference to the currency document
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(currency.id);

  const transactionsRef = db // Reference to the user's transactions document
    .collection("users")
    .doc(user.uid)
    .collection("transactions")
    .doc(); // Generates a new document reference for a transaction

  try {
    // Run a transaction to withdraw the currency
    await db.runTransaction(async (transaction) => {
      const currenceyDoc = await transaction.get(currenceyRef); // Retrieve the currency document

      // Retrieve the current amount from the document
      const currencyCurrentAmount = currenceyDoc.data()
        ? currenceyDoc.data().amount
        : 0;

      if (currencyCurrentAmount < amount) {
        // Check if the user has sufficient funds
        console.log("Insufficient funds!");
        return "Error: Insufficient funds!";
      }

      // Calculate the new amount
      const newCurrenceyAmount = currencyCurrentAmount - amount;

      // Update the document with the new amount
      if (currenceyDoc.exists) {
        transaction.update(currenceyRef, {
          amount: newCurrenceyAmount,
        }); // Update the document with the new amount
      } else {
        transaction.set(currenceyRef, {
          id: currency.id,
          amount: newCurrenceyAmount,
        }); // Create a new document with the new amount
      }

      // Add a new transaction record
      transaction.set(transactionsRef, {
        accountBalance: accountBalance,
        currencyId: currency.id,
        amount: amount,
        price: currency.current_price,
        bankAccountDetails: bankAccountDetails,
        transactionType: "withdraw",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Stores the time the transaction was made
      });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.log("Transaction failed: ", error);
  }
}

// Convert Firestore timestamp to Date object
export function convertTimestampToDate(timestamp) {
  return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
}

// Delete the user account and all associated data
export async function deleteUserAccount() {
  const db = firebase.firestore(); // Initialize Firestore database reference
  const user = auth.currentUser; // Get the current user

  const userDocRef = db.collection("users").doc(user.uid); // Reference to the user document

  // Run a transaction to delete the user account and all associated data
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userDocRef);

    // Delete the user document
    if (userDoc.exists) {
      transaction.delete(userDocRef); // Delete the user document
    }

    // Delete the user's authentication record
    await user.delete();
  });
}

// Update the user profile data
export async function updateUserProfile(
  firstName,
  lastName,
  phone,
  oldPassword,
  newPassword,
) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  // Firestore document reference
  const userDocRef = db.collection("users").doc(user.uid);

  // If newPassword is provided, re-authenticate and update password
  if (newPassword) {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword,
      ); // Create credential

      // Re-authenticate user with credential before updating password
      await user.reauthenticateWithCredential(credential);
    } catch (error) {
      // Handle or throw specific error for re-authentication failure
      throw new Error("Re-authentication failed: " + error.message);
    }

    // Update password
    await updatePassword(user, newPassword);
  }

  // Update Firestore document
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userDocRef);
    if (!userDoc.exists) {
      throw new Error("User document does not exist!"); // Handle or throw specific error
    }
    transaction.update(userDocRef, {
      displayName: `${firstName} ${lastName}`,
      phone: phone,
    });
  });

  // Update profile
  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  console.log("User account successfully updated!");
}
