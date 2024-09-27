import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataSparkline from "../../../table/currenciesTable/dataSparkline.jsx";
import HoldingCoinTable from "../../../table/holdingCoinsTable/holdingCoinsTable.jsx";
import { useAuth } from "../../../../AuthContext.js";
import "./dashboard.css";
import { removeTrailingZeros } from "../../../../../public/publicFunctions.jsx";
import Footer from "../../../footer.jsx";
import { setPathLocation } from "../../../../App.jsx";
import { convertTimestampToDate } from "../../../../firebase.js";
import { useRecoilValue } from "recoil";
import { cryptoData } from "../../../../atoms/cryptoData.js";

// This component is used to display the user's dashboard
export default function Dashboard() {
  const { t } = useTranslation(); // Translation function

  const { currentUser, currentUserData } = useAuth(); // Get the current user and user data
  const cryptoCurrenciesData = useRecoilValue(cryptoData); // Get the crypto currencies data

  const [walletData, setWalletData] = useState([]); // State to store the wallet data
  const [transactionsData, setTransactionsData] = useState([]); // State to store the transactions data
  const [displayedCoin, setDisplayedCoin] = useState(false); // State to show or hide the coin selection
  const [selectedCoin, setSelectedCoin] = useState("BTC"); // State to store the selected coin

  // Update the document title when the component mounts
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("dashboard") + " | " + t("cryptoPulse");

    // Optional: Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  // Update the wallet data when the user data changes
  useEffect(() => {
    // Update the wallet data when the user data changes
    if (!currentUserData || cryptoCurrenciesData.data.length === 0) {
      return;
    }
    // Map the wallet data to include the currency data
    const holdingCoins = currentUserData.wallet.map((coin) => {
      const currencyData = cryptoCurrenciesData.data.find(
        (currency) => currency.id === coin.id,
      );
      return { ...coin, ...currencyData };
    });

    setWalletData(holdingCoins);
  }, [cryptoCurrenciesData.data]);

  // Update the transactions data when the user data changes
  useEffect(() => {
    // Update the wallet data when the user data changes
    if (!currentUserData.email) {
      return;
    }
    // Filter the transactions to exclude trades
    const sortedTransactionsAsc = currentUserData.transactions
      .filter((transaction) => transaction.transactionType !== "trade")
      .sort(
        (a, b) =>
          convertTimestampToDate(a.timestamp) -
          convertTimestampToDate(b.timestamp),
      );
    // Map the account balance data
    const accountBalance = sortedTransactionsAsc.map((transaction) => {
      return transaction.accountBalance;
    });
    setTransactionsData(accountBalance);
  }, [currentUserData]);

  // Function to copy the user ID to the clipboard
  function copyUserId() {
    navigator.clipboard
      .writeText(currentUser.uid)
      .then(() => {
        // Show the tooltip
        const tooltip = document.getElementById("tooltip");
        tooltip.style.visibility = "visible";

        // Hide the tooltip after 2 seconds
        setTimeout(() => {
          tooltip.style.visibility = "hidden";
        }, 1500);
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

  // Function to calculate the balance based on the wallet data
  function calculateBalance() {
    // Calculate the balance based on the wallet data
    let balance = 0;
    walletData.forEach((coin) => {
      balance += parseFloat(coin.amount) * coin.current_price;
    });
    if (selectedCoin.toLowerCase() === "usd") {
      return removeTrailingZeros(balance, 10);
    }
    const selectedCoinData = cryptoCurrenciesData.data.find(
      (coin) => coin.symbol.toLowerCase() === selectedCoin.toLowerCase(),
    );
    if (!selectedCoinData) {
      return removeTrailingZeros(balance, 10);
    }
    balance = balance / selectedCoinData.current_price;
    return removeTrailingZeros(balance, 10);
  }

  // Function to calculate the estimated value based on the wallet data
  function calculateEstimatedValue() {
    // Calculate the estimated value based on the wallet data
    let estimatedValue = 0;
    walletData.forEach((coin) => {
      estimatedValue += parseFloat(coin.amount) * coin.current_price;
    });
    return removeTrailingZeros(estimatedValue, 10);
  }

  return (
    <div className="scrollable-content content">
      <div className="m-2 md:m-5 text-slate-950 dark:text-white flex flex-col items-center gap-5 md:gap-10 ">
        <div className="flex divide-x gap-5 w-full md:w-[70%]">
          <div className="flex justify-center items-center">
            <i className="material-icons" style={{ fontSize: "100px" }}>
              account_circle
            </i>
            <h1 className="text-3xl font-bold ml-2">
              {currentUserData.displayName}
            </h1>
          </div>

          <div className="hidden md:flex justify-center items-center pl-5 gap-10">
            <div className="w-full">
              <h5 className="font-semibold text-gray-400">{t("userID")}</h5>
              <div className="flex justify-center items-center gap-2">
                {currentUserData.uid}
                <div className="relative inline-block">
                  <button
                    id="copyButton"
                    onClick={copyUserId}
                    className="material-icons text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
                  >
                    content_copy
                  </button>
                  <div
                    id="tooltip"
                    className="tooltip bg-gray-200 dark:bg-gray-600 font-medium text-sm"
                  >
                    {t("userIDcopied")}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <h5 className="font-semibold text-gray-400">{t("mail")}</h5>
              <p>{currentUserData.email}</p>
            </div>
            <div className="w-full">
              <h5 className="font-semibold text-gray-400">{t("phone")}</h5>
              <p>{currentUserData.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start md:border w-full md:w-[70%] dark:border-gray-500 md:rounded-lg p-2 md:p-5">
          <div className="flex flex-col w-full">
            <h2 className="mb-5 text-xl font-bold">{t("estimatedBalance")}</h2>
            <div className="mb-5 flex items-end">
              <h2 className="text-3xl font-bold me-3">{calculateBalance()}</h2>
              <div className="relative inline-block">
                <button
                  onClick={() => setDisplayedCoin(!displayedCoin)}
                  className="flex items-center"
                >
                  {selectedCoin}
                  <i className="material-icons text-sm text-gray-500 dark:text-gray-300">
                    expand_more
                  </i>
                </button>
                {displayedCoin && (
                  <div className="z-50 w-32 my-4 py-2 font-medium text-base list-none bg-white rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoin("BTC");
                        setDisplayedCoin(false);
                      }}
                      className={`p-2 flex justify-start items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCoin === "BTC" ? "text-teal-500 dark:text-custom-teal" : "text-black dark:text-white"}`}
                      style={{ width: "-webkit-fill-available" }}
                    >
                      BTC
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoin("ETH");
                        setDisplayedCoin(false);
                      }}
                      className={`p-2 flex justify-start items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCoin === "ETH" ? "text-custom-teal dark:text-custom-teal" : "text-black dark:text-white"}`}
                      style={{ width: "-webkit-fill-available" }}
                    >
                      ETH
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoin("USD");
                        setDisplayedCoin(false);
                      }}
                      className={`p-2 flex justify-start items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCoin === "USD" ? "text-custom-teal dark:text-custom-teal" : "text-black dark:text-white"}`}
                      style={{ width: "-webkit-fill-available" }}
                    >
                      USD
                    </button>
                  </div>
                )}
              </div>
            </div>
            <h2 className="mb-5 text-md">
              {"≈ $" + calculateEstimatedValue()}
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between font-semibold mb-2 gap-3">
              <button
                onClick={() => setPathLocation("/home/dashboard/withdraw")}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg"
              >
                {t("withdraw")}
              </button>
              <button
                onClick={() => setPathLocation("/home/dashboard/cashin")}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg"
              >
                {t("cashIn")}
              </button>
            </div>
            <DataSparkline data={transactionsData} width={400} height={100} />
          </div>
        </div>
        <div className="flex flex-col justify-between items-start w-full md:w-[70%] md:border dark:border-gray-500 md:rounded-lg p-2 md:p-5 ">
          <h2 className="mb-5 text-xl font-bold">{t("holding")}</h2>

          <HoldingCoinTable data={walletData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
