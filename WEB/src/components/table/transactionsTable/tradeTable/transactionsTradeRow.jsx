import React from "react";
import { removeTrailingZeros } from "../../../../../public/publicFunctions";
import { convertTimestampToDate } from "../../../../firebase";

// This component is used to display a row in the transactions trade table
export const TransactionsTradeRow = (prop) => {
  const transaction = prop.data; // Get the transaction data

  // Function to format a date
  function formatDate(date) {
    // Get the day, month, year, hours and minutes
    let day = date.getDate();
    let month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Pad single digits with leading zeros
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  }

  return (
    <tr className="border-b hover:bg-gray-200 dark:hover:bg-gray-900 font-bold">
      <td className="py-2 md:table-cell hidden">
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={transaction.soldCurrency.image}
            alt={transaction.soldCurrency.name + " Logo"}
          />
          <div className="flex flex-col justify-start items-start">
            {transaction.soldCurrency.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {transaction.soldCurrency.name}
            </span>
          </div>
        </div>
      </td>
      <td className="py-2 md:hidden">
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={transaction.soldCurrency.image}
            alt={transaction.soldCurrency.name + " Logo"}
          />
          <div className="flex flex-col justify-start items-start">
            {transaction.soldCurrency.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {removeTrailingZeros(transaction.soldCurrency.amount) +
                " " +
                transaction.soldCurrency.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </td>
      <td className="py-2 md:table-cell hidden">
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={transaction.boughtCurrency.image}
            alt={transaction.boughtCurrency.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {transaction.boughtCurrency.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {transaction.boughtCurrency.name}
            </span>
          </div>
        </div>
      </td>
      <td className="py-2 md:hidden">
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={transaction.boughtCurrency.image}
            alt={transaction.boughtCurrency.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {transaction.boughtCurrency.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {removeTrailingZeros(transaction.boughtCurrency.amount) +
                " " +
                transaction.boughtCurrency.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      </td>
      <td className={`py-2 text-end md:table-cell hidden`}>
        {removeTrailingZeros(transaction.soldCurrency.amount) +
          " " +
          transaction.soldCurrency.symbol.toUpperCase()}
      </td>
      <td className={`py-2 text-end md:table-cell hidden`}>
        {removeTrailingZeros(transaction.boughtCurrency.amount) +
          " " +
          transaction.boughtCurrency.symbol.toUpperCase()}
      </td>
      <td className="py-2 text-end md:table-cell hidden">
        {formatDate(convertTimestampToDate(transaction.timestamp))}
      </td>
    </tr>
  );
};

export default TransactionsTradeRow;
