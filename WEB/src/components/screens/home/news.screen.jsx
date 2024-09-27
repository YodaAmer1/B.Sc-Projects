import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NewsTable from "../../table/newsTable/newsTable";
import { useRecoilState } from "recoil";
import { cryptoNews } from "../../../atoms/cryptoNews";
import Footer from "../../footer";

// This component is used to display the News screen
export default function News() {
  const { t } = useTranslation(); // Translation function
  const [cryptoCurrenciesNews, setCryptoCurrenciesNews] =
    useRecoilState(cryptoNews); // Get the crypto currencies news data

  // Set the document title when the component mounts
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("news") + " | " + t("cryptoPulse");

    // Optional: Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  // Function to filter the data based on the search input
  const filterData = (e) => {
    const value = e.target.value.toLowerCase();
    const data = [...cryptoCurrenciesNews.data];
    const filteredData = data.filter((news) => {
      return (
        news.title.toLowerCase().includes(value) ||
        news.body.toLowerCase().includes(value) ||
        news.tags.toLowerCase().includes(value) ||
        news.categories.toLowerCase().includes(value)
      );
    });
    setCryptoCurrenciesNews({
      ...cryptoCurrenciesNews,
      filterdData: filteredData,
    });
  };

  return (
    <div className="scrollable-content content">
      <div className="m-5 text-slate-950 dark:text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
          <h1 className="text-3xl font-bold">{t("latestNews")}</h1>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center pl-2 pointer-events-none material-icons text-gray-500 dark:text-gray-400">
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
        <div className="rounded-lg grid gap-4 border-gray-300 dark:border-gray-600">
          {cryptoCurrenciesNews.updatedTime ? (
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              {t("lastUpdated")} {cryptoCurrenciesNews.updatedTime}
            </div>
          ) : null}
          <NewsTable news={cryptoCurrenciesNews.filterdData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
