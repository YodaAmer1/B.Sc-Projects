import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HoldingCoinsRow from "./holdingCoinsRow";
import { Paging } from "../paging";
import LoadingDataScreen from "../loading.data.screen";
import { useAuth } from "../../../AuthContext";

// This component is used to display the Holding Coins Table
export const holdingCoinTable = (prop) => {
  const { t } = useTranslation(); // Translation function
  const currenciesPerPage = 3; // Number of currencies per page
  const { currentUserData } = useAuth(); // Get the current user and user data
  const [sortedData, setSortedData] = useState([...prop.data]); // State to store the sorted data
  const [data, setData] = useState([...prop.data].slice(0, currenciesPerPage)); // State to store the data to display
  const [sort, setSort] = useState({ field: "", asc: null }); // State to store the sort field and order
  const [currentPage, setCurrentPage] = useState(1); // State to store the current page

  // Update the data when the data changes
  useEffect(() => {
    setSortedData([...prop.data]);
    setData([...prop.data].slice(0, currenciesPerPage));
  }, [prop.data]);

  // Update the data when the sorted data changes
  useEffect(() => {
    handlePageChange();
  }, [sortedData, currentPage]);

  // Function to calculate the total number of pages
  const totalPageNumber = () => {
    return Math.ceil(sortedData.length / currenciesPerPage) || 1;
  };

  // Function to update the data when the current page changes
  function sortData(field) {
    if (sort.field === field) {
      // If the data is already sorted by the field
      if (sort.asc === false) {
        // If the data is sorted in descending order
        setSortedData(
          [...prop.data].sort((a, b) => {
            if (typeof a[field] === "number") {
              return b[field] - a[field];
            } else {
              return ("" + b[field]).localeCompare(a[field]);
            }
          }),
        );
        setSort({ field, asc: true });
        return;
      }
      setSortedData([...prop.data]);
      setSort({ field: "", asc: null });
      return;
    }
    setSortedData(
      [...prop.data].sort((a, b) => {
        if (typeof a[field] === "number") {
          return a[field] - b[field];
        } else {
          return ("" + a[field]).localeCompare(b[field]);
        }
      }),
    );
    setSort({ field, asc: false });
  }

  // Function to handle the page change
  const headerCell = (field, title) => {
    return (
      <div className="flex justify-end items-center">
        {t(title)}
        {checkIfSortedBy(field) ? (
          <i className="material-icons">
            {sort.asc ? "expand_less" : "expand_more"}
          </i>
        ) : null}
      </div>
    );
  };

  // Function to handle the page change
  function handlePageChange() {
    setData(
      [...sortedData].slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
  }

  // Function to check if the data is sorted by the field
  function checkIfSortedBy(field) {
    return sort.field === field;
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="w-full">
          <tr className="bg-white dark:bg-gray-800 border-b">
            <th className="text-start text-gray-400">{t("coin")}</th>
            <th
              onClick={() => sortData("amount")}
              className="text-end text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("amount", "amount")}
            </th>
            <th
              onClick={() => sortData("current_price")}
              className="md:table-cell hidden text-end text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("current_price", "coinPrice")}
            </th>
            <th
              onClick={() =>
                sortData("price_change_percentage_24h_in_currency")
              }
              className="md:table-cell hidden text-end text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell(
                "price_change_percentage_24h_in_currency",
                "today'sPnL",
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <HoldingCoinsRow data={d} key={d.id} header={false} />
          ))}
        </tbody>
      </table>
      {currentUserData.wallet.length === 0 ? (
        <div>
          <h1 className="text-2xl text-center mt-5">{t("no-transactions")}</h1>
        </div>
      ) : (
        data.length === 0 && (
          <div className="h-20">
            <LoadingDataScreen />
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
};

export default holdingCoinTable;
