import React, { useEffect, useState } from "react";
import NewsTab from "./newsTab";
import { Paging } from "../paging";
import LoadingDataScreen from "../loading.data.screen";
import { useRecoilValue } from "recoil";
import { cryptoNews } from "../../../atoms/cryptoNews";
import { useTranslation } from "react-i18next";

// This component is used to display the News Table
export default function NewsTable({ news }) {
  const { t } = useTranslation(); // Translation function
  const newsPerPage = 3; // Number of news per page
  const [currentPage, setCurrentPage] = useState(1); // State to store the current page
  const [data, setData] = useState([...news].slice(0, newsPerPage)); // State to store the data to display
  const cryptoNewsData = useRecoilValue(cryptoNews); // Get the crypto currencies data

  // Function to calculate the total number of pages
  useEffect(() => {
    if (totalPageNumber() < currentPage) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [news, currentPage]);

  // Function to calculate the total number of pages
  const totalPageNumber = () => {
    return Math.ceil(news.length / newsPerPage) || 1;
  };

  // Function to update the data when the current page changes
  function handlePageChange() {
    setData(
      [...news].slice(
        (currentPage - 1) * newsPerPage,
        currentPage * newsPerPage,
      ),
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-5">
        {data.map((news_object) => {
          return <NewsTab news_object={news_object} key={news_object.id} />;
        })}
      </div>
      {cryptoNewsData.data.length === 0 ? (
        <div className="h-20">
          <LoadingDataScreen />
        </div> // If there is no data to display
      ) : (
        cryptoNewsData.filterdData.length === 0 && (
          <div>
            <h1 className="text-2xl text-center mt-5">{t("noData")}</h1>
          </div>
        )
      )}
      <Paging
        totalPageNumber={totalPageNumber}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
