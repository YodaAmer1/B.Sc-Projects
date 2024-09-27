import React from "react";
import { removeTrailingZeros } from "../../../../public/publicFunctions";

// This component is used to display a row in the holding coins table
export const HoldingCoinsRow = (prop) => {
  const crypto = prop.data; // Get the crypto currency data

  // Function to create an amount cell
  const amount = () => {
    return (
      <div className="flex flex-col text-md font-semibold">
        {removeTrailingZeros(crypto.amount) + " " + crypto.symbol.toUpperCase()}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {"$ " + removeTrailingZeros(crypto.amount * crypto.current_price)}
        </span>
      </div>
    );
  };

  // Function to create a change element
  function createChangeElement(change) {
    const changeNegative = change < 0;
    change = changeNegative ? change * -1 : change;

    const change_icon = changeNegative ? "-" : "+";

    return (
      <div
        className={`flex justify-end items-center font-semibold ${changeNegative ? "text-red" : "text-green"}`}
      >
        <div className="ml-3">{change_icon + change.toFixed(3) + "%"}</div>
      </div>
    );
  }

  return (
    <tr className="border-b hover:bg-gray-200 dark:hover:bg-gray-900 font-semibold">
      <td className="py-2 text-start">
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={crypto.image}
            alt={crypto.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {crypto.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {crypto.name}
            </span>
          </div>
        </div>
      </td>
      <td className="py-2 text-end">{amount()}</td>
      <td className="py-2 md:table-cell hidden text-end">
        {"$ " + removeTrailingZeros(crypto.current_price)}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {createChangeElement(crypto.price_change_percentage_24h_in_currency)}
      </td>
    </tr>
  );
};

export default HoldingCoinsRow;
