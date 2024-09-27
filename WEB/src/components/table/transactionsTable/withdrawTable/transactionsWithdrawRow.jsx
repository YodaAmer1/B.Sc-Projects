import React from "react";
import { removeTrailingZeros } from "../../../../../public/publicFunctions";
import { convertTimestampToDate } from "../../../../firebase";

// This component is used to display a row in the transactions withdraw table
export const TransactionsWithdrawRow = (prop) => {
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

  // Function to remove trailing zeros
  const amountCell = () => {
    return (
      <div className="flex flex-col justify-center items-end">
        <div>
          {parseFloat(transaction.amount.toFixed(5)).toLocaleString() +
            " " +
            transaction.symbol.toUpperCase()}
        </div>
        <div className="font-semibold text-sm text-gray-500 dark:text-gray-400">
          {"$" + removeTrailingZeros(transaction.price)}
        </div>
      </div>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-200 dark:hover:bg-gray-900 font-bold">
      <td className="py-2">
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={transaction.image}
            alt={transaction.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {transaction.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {transaction.name}
            </span>
          </div>
        </div>
      </td>
      <td className="py-2 text-end">{amountCell()}</td>
      <td className="py-2 md:table-cell hidden text-end">
        ******{transaction.bankAccountDetails.accountNumber.slice(-3)}
      </td>
      <td className="py-2 text-end">
        {formatDate(convertTimestampToDate(transaction.timestamp))}
      </td>
    </tr>
  );
};

export default TransactionsWithdrawRow;
