import React, { useEffect, useState } from "react";
import Logo from "../assets/icons/logo.png";
import { useTranslation } from "react-i18next";

// This component is used to display the loading screen
const LoadingScreen = () => {
  const { t } = useTranslation(); // Translation function
  const [isDarkMode, setIsDarkMode] = useState(false); // State to store the dark mode

  // Check if the dark mode is enabled
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className=" flex flex-col justify-center items-center">
        <img
          className="flex justify-center items-center max-w-48 bg-transparent"
          loading="lazy"
          src={Logo}
          alt={t("cryptoPulse") + " logo"}
        />
        <div className="absolute loader" />
      </div>
      <h1
        className={`m-10 text-5xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
      >
        {t("loading")}
      </h1>
    </div>
  );
};

export default LoadingScreen;
