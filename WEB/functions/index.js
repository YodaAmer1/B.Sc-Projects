/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const { DateTime } = require("luxon");

admin.initializeApp();

// Schedule this function to run every hour to fetch and store crypto data
exports.fetchAndStoreCryptoData = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async (context) => {
    const url = "https://api.coingecko.com/api/v3/coins/markets"; //API Crypto Data URL

    // Set the parameters for the API request
    const parameters = {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 100,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    };
    const queryString = new URLSearchParams(parameters).toString(); //Convert the parameters to a query string
    const fetchUrl = `${url}?${queryString}`; //Combine the URL and the query string

    try {
      const response = await fetch(fetchUrl); //Fetch Crypto Data
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); //Convert the response to JSON

      const batch = admin.firestore().batch(); //Create a firestore batch

      // Loop through the data and add it to the batch
      data.forEach((coin) => {
        const docRef = admin
          .firestore()
          .collection("cryptocurrencies")
          .doc(coin.id);
        batch.set(docRef, coin);
      });

      // Add a timestamp to the batch
      const docRef = admin
        .firestore()
        .collection("cryptocurrencies")
        .doc("updatedTimeStamp");

      // Get the current time in Israel's time zone
      const timeInIsrael = DateTime.now().setZone("Asia/Jerusalem");

      // Format the time as you need it
      const formattedTime = timeInIsrael.toFormat("dd/MM/yyyy HH:mm:ss");
      batch.set(docRef, { timeStamp: formattedTime });
      await batch.commit();
      console.log("Successfully updated cryptocurrencies data");
    } catch (error) {
      console.error("Error fetching cryptocurrencies data:", error);
    }
  });

// Schedule this function to run every hour to fetch and store crypto news
exports.fetchAndStoreCryptoNews = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async (context) => {
    const url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"; //API Crypto News Data URL

    try {
      const response = await fetch(url); //Fetch Crypto news Data
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const cryptoNews = await response.json(); //Convert the response to JSON

      const batch = admin.firestore().batch(); //Create a firestore batch
      const db = admin.firestore();
      const cryptonewsRef = db.collection("cryptonews");

      const snapshot = await cryptonewsRef.get();
      if (!snapshot.empty) {
        // Batch delete
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      // Loop through the data and add it to the batch
      cryptoNews.Data.forEach((news) => {
        const docRef = cryptonewsRef.doc(news.id);
        batch.set(docRef, news);
      });

      const docRef = cryptonewsRef.doc("updatedTimeStamp");

      // Get the current time in Israel's time zone
      const timeInIsrael = DateTime.now().setZone("Asia/Jerusalem");

      // Format the time as you need it
      const formattedTime = timeInIsrael.toFormat("dd/MM/yyyy, HH:mm:ss");
      batch.set(docRef, { timeStamp: formattedTime });

      await batch.commit(); // Commit the batch
      console.log("Successfully updated crypto news data");
    } catch (error) {
      console.error("Error fetching crypto news data:", error);
    }
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
