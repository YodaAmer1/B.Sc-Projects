import React from "react";
import { useTranslation } from "react-i18next";

// This component is used to display the loading data screen
export default function LoadingDataScreen() {
  const { t } = useTranslation(); // Translation function

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex items-center justify-center gap-5">
        {/* <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" /> */}
        <p className="text-gray-900 dark:text-white text-3xl font-semibold">
          {t("fetchingdata")}
        </p>
        <div className="loading-container">
          <span
            className="dot bg-gray-900 dark:bg-white"
            style={{ height: "20px", width: "20px" }}
          />
          <span
            className="dot bg-gray-900 dark:bg-white"
            style={{ height: "20px", width: "20px" }}
          />
          <span
            className="dot bg-gray-900 dark:bg-white"
            style={{ height: "20px", width: "20px" }}
          />
        </div>
      </div>
    </div>
  );
}
