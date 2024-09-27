import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TransactionsBuyTable from "../../table/transactionsTable/buyTable/transactionsBuyTable.jsx";
import TransactionsTradeTable from "../../table/transactionsTable/tradeTable/transactionsTradeTable.jsx";
import { useAuth } from "../../../AuthContext.js";
import Footer from "../../footer.jsx";
import TransactionsWithdrawTable from "../../table/transactionsTable/withdrawTable/transactionsWithdrawTable.jsx";
import { useRecoilValue } from "recoil";
import { cryptoData } from "../../../atoms/cryptoData.js";
import { doc } from "firebase/firestore";

// This component is used to display the Transactions History screen
export default function TransactionsHistory() {
  const { t } = useTranslation(); // Translation function

  const { currentUserData } = useAuth(); // Get the current user data

  const [activeTab, setActiveTab] = useState("buy"); // State to track the active tab
  const [currencies, setCurrencies] = useState([]); // State to store the currencies data
  const cryptoCurrenciesData = useRecoilValue(cryptoData); // Get the crypto currencies data

  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to store the window width
  const [indicatorStyle, setIndicatorStyle] = useState({
    // State to store the indicator style of the tab buttons
    width: 0,
    transform: `translateX(0px)`, // Use the corrected offset
  });
  const tabRefs = useRef([]); // Ref to store the tab buttons

  // Update the indicator style when the active tab changes
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const { offsetLeft, clientWidth } = tabRefs.current[activeTab];
      setIndicatorStyle({
        width: clientWidth,
        transform: `translateX(${offsetLeft}px)`, // Use the corrected offset
      });
    }
  }, [activeTab, tabRefs, windowWidth]);

  // Update the currencies state when the crypto currencies data changes
  useEffect(() => {
    setCurrencies(
      cryptoCurrenciesData.data.map((currency) => ({
        id: currency.id,
        label: currency.name,
        image: currency.image,
        symbol: currency.symbol,
        ...currency,
      })),
    );
  }, [cryptoCurrenciesData.data]);

  // Set the document title when the component mounts
  useEffect(() => {
    document.title = t("transactions-history") + " | " + t("cryptoPulse");
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      document.title = t("cryptoPulse");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (
      activeTab // Switch statement to render the tab content based on the active tab
    ) {
      case "buy": // Render the Buy tab content
        return (
          <TransactionsBuyTable
            transactions={currentUserData.transactions}
            currencies={currencies}
          />
        );
      case "trade": // Render the Trade tab content
        return (
          <TransactionsTradeTable
            transactions={currentUserData.transactions}
            currencies={currencies}
          />
        );
      case "withdraw": // Render the Withdraw tab content
        return (
          <TransactionsWithdrawTable
            transactions={currentUserData.transactions}
            currencies={currencies}
          />
        );
      default:
        return null;
    }
  };

  // Function to render the tab button icon based on the tab
  const renderTabButtonIcon = (tab) => {
    switch (tab) {
      case "buy":
        return "shopping_cart";
      case "trade":
        return "compare_arrows";
      case "withdraw":
        return "account_balance";
      default:
        return "";
    }
  };

  // Function to render the tab button based on the tab
  const renderTabButton = (tab) => {
    return (
      <div
        className={`flex flex-col justify-start items-center text-xl font-semibold ${activeTab === tab && "text-custom-teal"}`}
      >
        <button
          ref={(el) => (tabRefs.current[tab] = el)}
          className="flex justify-center items-center gap-2 p-1 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={() => setActiveTab(tab)}
        >
          <i className="material-icons">{renderTabButtonIcon(tab)}</i>
          {t(tab)}
        </button>
      </div>
    );
  };

  return (
    <div className="scrollable-content content">
      <div className="p-5 text-slate-950 dark:text-white flex flex-col items-center justify-start">
        <h1 className="mb-5 text-3xl font-bold w-full">
          {t("transactions-history")}
        </h1>
        {/* Tab buttons */}
        <div className="w-full xl:w-[80%] flex flex-col justify-center items-start border-b md:p-0">
          <div className="flex justify-between md:justify-start w-full gap-5 relative">
            {renderTabButton("buy")}
            {renderTabButton("trade")}
            {renderTabButton("withdraw")}
          </div>
          <div
            className="w-full border-2 rounded border-custom-teal"
            style={{
              ...indicatorStyle,
              transition: "width 0.3s ease, transform 0.3s ease",
            }}
          />
        </div>

        {/* Tab content */}
        <div className="pt-5 md:p-5 h-full w-full xl:w-[80%]">
          {renderTabContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}
