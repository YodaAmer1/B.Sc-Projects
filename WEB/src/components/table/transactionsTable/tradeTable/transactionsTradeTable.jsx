import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TransactionsTradeRow } from "./transactionsTradeRow";
import { convertTimestampToDate } from "../../../../firebase";
import { Paging } from "../../paging";
import LoadingDataScreen from "../../loading.data.screen";
import { useAuth } from "../../../../AuthContext";

// This component is used to display the Transactions Trade Table
export default function TransactionsTradeTable({ transactions, currencies }) {
  const { t } = useTranslation(); // Translation function
  const transactionsPerPage = 7; // Number of transactions per page

  const { currentUserData } = useAuth(); // Get the current user and user data

  const [transactionsData, setTransactionsData] = useState([]); // State to store the transactions data
  const [data, setData] = useState([]); // State to store the data to display
  const [sort, setSort] = useState({ field: "", asc: null }); // State to store the sort field and order
  const [currentPage, setCurrentPage] = useState(1); // State to store the current page

  // Update the data when the transactions or currencies change
  useEffect(() => {
    updateTransactionsData();
  }, [transactions, currencies]);

  // Function to update the transactions data
  function updateTransactionsData() {
    if (!transactions || !currencies) {
      return;
    }
    // Filter out only "trade" transactions
    const transactionsFullData = transactions
      .filter((transaction) => transaction.transactionType === "trade") // Only include "trade" transactions
      .map((transaction) => {
        const soldCurrency = currencies.find(
          (currency) => currency.id === transaction.soldCurrency.id,
        );
        const boughtCurrency = currencies.find(
          (currency) => currency.id === transaction.boughtCurrency.id,
        );

        return {
          ...transaction,
          soldCurrency: {
            ...transaction.soldCurrency,
            name: soldCurrency.name,
            symbol: soldCurrency.symbol,
            image: soldCurrency.image,
          },
          boughtCurrency: {
            ...transaction.boughtCurrency,
            name: boughtCurrency.name,
            symbol: boughtCurrency.symbol,
            image: boughtCurrency.image,
          },
        };
      });

    transactionsFullData.sort(
      (a, b) =>
        convertTimestampToDate(b.timestamp) -
        convertTimestampToDate(a.timestamp),
    );

    setTransactionsData(transactionsFullData);
    handlePageChange();
  }

  // Function to calculate the total number of pages
  useEffect(() => {
    if (Math.ceil(data.length / transactionsPerPage) < currentPage) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [transactionsData]);

  // Function to calculate the total number of pages
  const totalPageNumber = () => {
    return Math.ceil(transactionsData.length / transactionsPerPage) || 1;
  };

  // Function to update the data when the current page changes
  useEffect(() => {
    handlePageChange();
  }, [currentPage]);

  // Function to sort the data based on the field
  function sortData(field, subField = null) {
    if (sort.field === field || sort.field === field + "." + subField) {
      // If the data is already sorted by the field

      if (sort.asc === false) {
        // If the data is sorted in descending order
        setData(
          data.sort((a, b) => {
            if (
              typeof a[field] === "number" ||
              typeof a[field][subField] === "number"
            ) {
              if (subField) {
                return b[field][subField] - a[field][subField];
              }
              return b[field] - a[field];
            } else {
              if (subField) {
                return ("" + b[field][subField]).localeCompare(
                  a[field][subField],
                );
              }
              return ("" + b[field]).localeCompare(a[field]);
            }
          }),
        );
        if (subField) {
          setSort({ field: field + "." + subField, asc: true });
          return;
        }
        setSort({ field, asc: true });
        return;
      }
      handlePageChange();
      setSort({ field: "", asc: null });
      return;
    }
    setData(
      data.sort((a, b) => {
        if (
          typeof a[field] === "number" ||
          typeof a[field][subField] === "number"
        ) {
          if (subField) {
            return a[field][subField] - b[field][subField];
          }
          return a[field] - b[field];
        } else {
          if (subField) {
            return ("" + a[field][subField]).localeCompare(b[field][subField]);
          }
          return ("" + a[field]).localeCompare(b[field]);
        }
      }),
    );
    if (subField) {
      setSort({ field: field + "." + subField, asc: false });
      return;
    }
    setSort({ field, asc: false });
  }

  // Function to handle the page change
  const headerCell = (field, title) => {
    return (
      <div
        className={`flex py-2 ${title === "toCurrency" || title === "fromCurrency" ? "justify-start" : "justify-end"} items-center`}
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
      transactionsData.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage,
      ),
    );
  }

  return (
    <div>
      <table className="w-full h-full">
        <thead>
          <tr className="border-b">
            <th
              onClick={() => sortData("soldCurrency", "name")}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("soldCurrency.name", "fromCurrency")}
            </th>

            <th
              onClick={() => sortData("boughtCurrency", "name")}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("boughtCurrency.name", "toCurrency")}
            </th>
            <th
              onClick={() => sortData("soldCurrency", "amount")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("soldCurrency.amount", "quantitySold")}
            </th>
            <th
              onClick={() => sortData("boughtCurrency", "amount")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("boughtCurrency.amount", "quantityBought")}
            </th>
            <th
              onClick={() => sortData("timestamp")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden text-gray-400 hover:text-black dark:hover:text-white"
            >
              {headerCell("timestamp", "time")}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <TransactionsTradeRow
              data={d}
              key={d.id}
              index={index + 1 + (currentPage - 1) * transactionsPerPage}
              header={false}
            />
          ))}
        </tbody>
      </table>
      {currentUserData.transactions?.filter(
        (t) => t.transactionType === "trade",
      ).length === 0 ? (
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
}
