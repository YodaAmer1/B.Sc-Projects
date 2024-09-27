import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CurrenciesTable from "../../table/currenciesTable/currenciesTable.jsx";
import { cryptoData } from "../../../atoms/cryptoData.js";
import { useRecoilState } from "recoil";
import Footer from "../../footer.jsx";

// This component is used to display the Coin screen
export default function Coin() {
  const { t } = useTranslation(); // Translation function
  const [cryptoCurrenciesData, setCryptoCurrenciesData] =
    useRecoilState(cryptoData); // Get the crypto currencies data

  // Set the document title when the component mounts
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("coins") + " | " + t("cryptoPulse");

    // Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  // Function to filter the data based on the search input
  const filterData = (e) => {
    const value = e.target.value.toLowerCase();
    const data = [...cryptoCurrenciesData.data];
    const filteredData = data.filter((crypto) => {
      return crypto.name.toLowerCase().includes(value);
    });
    setCryptoCurrenciesData({
      ...cryptoCurrenciesData,
      filterdData: filteredData,
    });
  };

  return (
    <div className="scrollable-content content">
      <div className="m-5 text-slate-950 dark:text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
          <h1 className="mb-5 text-3xl font-bold md: m-0">
            {t("cryptocurrencyPrices")}
          </h1>
          <div className="relative hidden md:block">
            <div className="material-icons absolute inset-y-0 start-0 flex items-center pl-2 pointer-events-none text-gray-500 dark:text-gray-400">
              search
            </div>
            <input
              type="text"
              onChange={filterData}
              className="pl-9 w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("search") + "..."}
            />
          </div>
        </div>
        <CurrenciesTable data={cryptoCurrenciesData} />
      </div>
      <Footer />
    </div>
  );
}
