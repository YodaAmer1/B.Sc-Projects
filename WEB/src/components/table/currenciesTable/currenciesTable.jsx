import React, { useState, useEffect } from "react";
import CurrenciesRow from "./currenciesRow";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { cryptoData } from "../../../atoms/cryptoData";
import { Paging } from "../paging";
import LoadingDataScreen from "../loading.data.screen";

// This component is used to display the Currencies Table
export const CurrenciesTable = () => {
  const { t } = useTranslation(); // Translation function
  const currenciesPerPage = 10; // Number of currencies per page

  const cryptoCurrenciesData = useRecoilValue(cryptoData); // Get the crypto currencies data
  const [data, setData] = useState(
    [...cryptoCurrenciesData.filterdData].slice(0, currenciesPerPage),
  ); // State to store the data to display
  const [sort, setSort] = useState({ field: "", asc: null }); // State to store the sort field and order
  const [currentPage, setCurrentPage] = useState(1); // State to store the current page

  // Update the data when the filtered data changes
  useEffect(() => {
    console.log(cryptoCurrenciesData.data);
    if (
      Math.ceil(cryptoCurrenciesData.filterdData.length / currenciesPerPage) <
      currentPage
    ) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [cryptoCurrenciesData]);

  // Function to calculate the total number of pages
  const totalPageNumber = () => {
    return (
      Math.ceil(cryptoCurrenciesData.filterdData.length / currenciesPerPage) ||
      1
    );
  };

  // Update the data when the current page changes
  useEffect(() => {
    handlePageChange();
  }, [currentPage]);

  // Function to sort the data based on the field
  function sortData(field) {
    if (sort.field === field) {
      // If the data is already sorted by the field
      if (sort.asc === false) {
        // If the data is sorted in descending order
        const sortedData = [...cryptoCurrenciesData.filterdData].sort(
          (a, b) => {
            if (typeof a[field] === "number") {
              return b[field] - a[field];
            } else {
              return ("" + b[field]).localeCompare(a[field]);
            }
          },
        );

        setData(
          sortedData.slice(
            (currentPage - 1) * currenciesPerPage,
            currentPage * currenciesPerPage,
          ),
        );
        setSort({ field, asc: true });
        return;
      }
      handlePageChange();
      setSort({ field: "", asc: null });
      return;
    }

    const sortedData = [...cryptoCurrenciesData.filterdData].sort((a, b) => {
      if (typeof a[field] === "number") {
        return a[field] - b[field];
      } else {
        return ("" + a[field]).localeCompare(b[field]);
      }
    });

    setData(
      sortedData.slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
    setSort({ field, asc: false });
  }

  // Function to render the header cell
  const headerCell = (field, title) => {
    return (
      <div
        className={`flex py-2 ${title === "name" ? "justify-start" : "justify-end"} items-center`}
      >
        {t(title)}
        {checkIfSortedBy(field) ? (
          <i className="material-icons">
            {sort.asc ? "expand_less" : "expand_more"}
          </i>
        ) : null}
      </div>
    );
  };

  // Function to check if the data is sorted by the field
  function checkIfSortedBy(field) {
    return sort.field === field;
  }

  // Function to handle the page change
  function handlePageChange() {
    setData(
      [...cryptoCurrenciesData.filterdData].slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
  }

  return (
    <div>
      {cryptoCurrenciesData.updatedTime ? (
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          {t("lastUpdated")} {cryptoCurrenciesData.updatedTime}
        </div>
      ) : null}

      <table className="w-full h-full">
        <thead>
          <tr className="border-b">
            <th className="cursor-pointer bg-white dark:bg-gray-800 text-gray-400">
              #
            </th>
            <th
              onClick={() => sortData("name")}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("name", "name")}
            </th>
            <th
              onClick={() => sortData("current_price")}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("current_price", "price")}
            </th>
            <th
              onClick={() => sortData("price_change_percentage_1h_in_currency")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("price_change_percentage_1h_in_currency", "1h%")}
            </th>
            <th
              onClick={() =>
                sortData("price_change_percentage_24h_in_currency")
              }
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("price_change_percentage_24h_in_currency", "24h%")}
            </th>
            <th
              onClick={() => sortData("price_change_percentage_7d_in_currency")}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("price_change_percentage_7d_in_currency", "7d%")}
            </th>
            <th
              onClick={() => sortData("market_cap")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("market_cap", "marketCap")}
            </th>
            <th
              onClick={() => sortData("total_volume")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("total_volume", "volume")}
            </th>
            <th
              onClick={() => sortData("circulating_supply")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("circulating_supply", "circulatingSupply")}
            </th>
            <th className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white">
              {t("last7Days")}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <CurrenciesRow
              data={d}
              key={d.id}
              index={index + 1 + (currentPage - 1) * currenciesPerPage}
              header={false}
            />
          ))}
        </tbody>
      </table>
      {cryptoCurrenciesData.data.length === 0 ? (
        <div className="h-20">
          <LoadingDataScreen />
        </div> // If there is no data to display
      ) : (
        cryptoCurrenciesData.filterdData.length === 0 && (
          <div>
            <h1 className="text-2xl text-center mt-5">{t("noData")}</h1>
          </div>
        )
      )}
      {/* <div className={`${data.length === 0 ? "" : "hidden"} h-20`}>
        <LoadingDataScreen />
      </div> */}
      <Paging
        totalPageNumber={totalPageNumber}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CurrenciesTable;
