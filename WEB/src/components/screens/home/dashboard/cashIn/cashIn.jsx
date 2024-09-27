import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../../../footer.jsx";
import { useAuth } from "../../../../../AuthContext.js";
import Alert from "../../../../alert/alert.jsx";
import BuyCurrencyScreen from "./buy.currencey.screen.jsx";
import TradeCurrencyScreen from "./trade.currencey.screen.jsx";
import { cryptoData } from "../../../../../atoms/cryptoData.js";
import { useRecoilValue } from "recoil";

// This component is used to display the Cash In screen
export default function CashIn() {
  const { t } = useTranslation(); // Translation function

  const { currentUser, currentUserData, fetchUserData } = useAuth(); // Get the current user and user data

  const [alertVisible, setAlertVisible] = useState(false); // State to show or hide the alert
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);
  const [alertData, setAlertData] = useState({
    // State to store the alert data
    title: "",
    message: "",
    messageType: "",
    action: null,
  });

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("buy");
  const [currencies, setCurrencies] = useState(); // State to store the currencies data
  const cryptoCurrenciesData = useRecoilValue(cryptoData); // Get the crypto currencies data

  // State to store the indicator style of the tab buttons
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: `translateX(0px)`, // Use the corrected offset
  });
  const tabRefs = useRef([]); // Ref to store the tab buttons

  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to store the window width

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

  // Update the document title and window width when the component mounts
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("cashIn") + " | " + t("cryptoPulse");
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

  // Function to handle the alert to pass to the child components
  const handleAlert = ({ title, message, messageType, action }) => {
    setAlertData({
      title: title,
      message: message,
      messageType: messageType,
      action: action,
    });
    showAlert();
  };

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <BuyCurrencyScreen
            currencies={currencies}
            currentUser={currentUser}
            currentUserData={currentUserData}
            fetchUserData={fetchUserData}
            alert={handleAlert}
          />
        );
      case "trade":
        return (
          <TradeCurrencyScreen
            currencies={currencies}
            currentUser={currentUser}
            currentUserData={currentUserData}
            fetchUserData={fetchUserData}
            alert={handleAlert}
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
      default:
        return "";
    }
  };

  // Function to render the tab content based on the active tab
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
    <div className="scrollable-content content w-full">
      <div className="p-5 text-slate-950 dark:text-white flex flex-col items-center justify-start">
        {/* Tab buttons */}
        <div className="w-full xl:w-[80%] flex flex-col justify-center items-start border-b md:p-0">
          <div className="flex justify-between md:justify-start w-full gap-5 relative">
            {renderTabButton("buy")}
            {renderTabButton("trade")}
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
      <Alert
        title={alertData.title}
        message={alertData.message}
        isVisible={alertVisible}
        onClose={hideAlert}
        messageType={alertData.messageType}
        action={alertData.action}
      />
      <Footer />
    </div>
  );
}
