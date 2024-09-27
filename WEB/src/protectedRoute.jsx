import { Navigate, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { cryptoData } from "./atoms/cryptoData";
import { cryptoNews } from "./atoms/cryptoNews";
import { useEffect } from "react";
import {
  fetchCryptoCurrenciesFromFirestore,
  fetchCryptoNewsFromFirestore,
} from "./firebase.js";

// This component is used to redirect the user to the welcome page if they are not authenticated
const ProtectedRoute = ({ isAuthenticated }) => {
  const [cryptoCurrenciesData, setCryptoCurrenciesData] =
    useRecoilState(cryptoData); // Get the crypto currencies data from Recoil
  const [cryptoCurrenciesNews, setCryptoCurrenciesNews] =
    useRecoilState(cryptoNews); // Get the crypto news data from Recoil

  // Update the crypto currencies data and news data when the user is authenticated
  useEffect(() => {
    // Check if the user is authenticated
    if (isAuthenticated) {
      if (cryptoCurrenciesData.data.length === 0) {
        updateCurrenciesData();
      }
      if (cryptoCurrenciesNews.data.length === 0) {
        updateCryptoNewsData();
      }
    } else {
      // If the user is not authenticated, clear the data
      setCryptoCurrenciesData({
        data: [],
        filterdData: [],
        updatedTime: null,
      });
      setCryptoCurrenciesNews({
        data: [],
        filterdData: [],
        updatedTime: null,
      });
    }
  }, [isAuthenticated]);

  // Function to update the crypto currencies data
  async function updateCurrenciesData() {
    try {
      // Fetch the crypto currencies data from Firestore
      const currenciesData = await fetchCryptoCurrenciesFromFirestore();

      setCryptoCurrenciesData({
        data: currenciesData.currencies,
        filterdData: currenciesData.currencies,
        updatedTime: currenciesData.updatedTime,
      });
    } catch (error) {
      console.log("Transaction failed: ", error);
    }
  }

  // Function to update the crypto news data
  async function updateCryptoNewsData() {
    try {
      // Fetch the crypto news data from Firestore
      const newsData = await fetchCryptoNewsFromFirestore();
      console.log(newsData);
      setCryptoCurrenciesNews({
        data: newsData.news,
        filterdData: newsData.news,
        updatedTime: newsData.updatedTime,
      });
    } catch (error) {
      console.log("Transaction failed: ", error);
    }
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" replace />;
};

export default ProtectedRoute;
