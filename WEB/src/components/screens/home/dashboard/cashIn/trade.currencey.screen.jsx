import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { removeTrailingZeros } from "../../../../../../public/publicFunctions";
import Select from "react-select";
import { tradeCrypto } from "../../../../../firebase";

// This component is used to display the Trade Currency screen
const TradeCurrencyScreen = ({
  currencies, // List of available currencies
  currentUserData, // Current user data
  fetchUserData, // Function to fetch the current user data
  currentUser, // Current user
  alert, // Function to display an alert
}) => {
  const { t } = useTranslation(); // Translation function

  const [walletCurrencies, setWalletCurrencies] = useState([]); // State to store the wallet currencies
  const [amountToSpend, setAmountToSpend] = useState(""); // State to store the amount to spend
  const [spendCurrency, setSpendCurrency] = useState(); // State to store the currency to spend
  const [receiveCurrency, setReceiveCurrency] = useState(); // State to store the currency to receive

  const [isLoading, setIsLoading] = useState(false); // State to track the loading state

  // Update the walletCurrencies state when the currentUserData.wallet or currencies change
  useEffect(() => {
    if (!currentUserData.wallet || currencies.length === 0) return;
    const walletCurrencies = currentUserData.wallet.map((walletCurrencey) => {
      const currency = currencies.find(
        (currency) => currency.id === walletCurrencey.id,
      );
      return {
        amount: walletCurrencey.amount,
        ...currency,
      };
    });
    console.log(walletCurrencies);
    setWalletCurrencies(walletCurrencies);
  }, [currentUserData.wallet, currencies]);

  // Function to validate the trade
  const validateTrade = () => {
    if (!spendCurrency || !receiveCurrency || !amountToSpend) {
      alert({
        title: "error",
        message: "errorFillAllFields",
      });
      return false;
    }
    return true;
  };

  // Function to handle the trade
  async function handleTrade() {
    if (!validateTrade()) return;
    try {
      setIsLoading(true);
      await tradeCrypto(
        currentUserData,
        spendCurrency,
        receiveCurrency,
        parseFloat(amountToSpend.replace(/[^0-9.]/g, "")),
        parseFloat(currencyAmount()),
      );
      // Fetch the updated user data
      fetchUserData(currentUser);
      alert({
        title: "success",
        message: "successTradeCrypto",
      });
    } catch (error) {
      console.log(error);
      alert({
        title: "error",
        message: "errorSomethingWentWrong",
      });
    } finally {
      // Reset the loading state
      setIsLoading(false);
      // Reset the form
      setAmountToSpend("");
      setSpendCurrency(null);
      setReceiveCurrency(null);
    }
  }

  // Custom option component
  const SelectCustomOption = ({ innerProps, isFocused, isSelected, data }) => {
    const isDisabled =
      !isSelected &&
      ((receiveCurrency && data.id === receiveCurrency.id) ||
        (spendCurrency && data.id === spendCurrency.id));
    return (
      <div
        {...innerProps}
        className={`text-sm flex justify-between items-center p-2 
        ${isFocused && "bg-gray-300 dark:bg-gray-600"} 
        ${isSelected && "font-bold text-custom-teal"} 
        ${isDisabled && "text-gray-500 dark:text-gray-400 opacity-50"}`}
      >
        <div className="flex justify-start h-full items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={data.image}
            alt={data.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {data.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.name}
            </span>
          </div>
        </div>
        {isSelected ? (
          <i className="material-icons">done</i>
        ) : (
          isDisabled && <i className="material-icons">block</i>
        )}
      </div>
    );
  };

  // Custom receive value component
  const CustomReceiveValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {"≈ " + currencyAmount() + " " + data.symbol.toUpperCase()}
    </div>
  );

  // Custom spend value component
  const CustomSpendValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {data.symbol.toUpperCase()}
      <div className="pl-2 text-gray-500 dark:text-gray-400">
        {" (" + data.name + ")"}
      </div>
    </div>
  );

  // Function to calculate the amount to receive
  const currencyAmount = () => {
    if (!receiveCurrency || !spendCurrency) return 0;
    const price =
      spendCurrency.current_price *
      parseFloat(amountToSpend.replace(/[^0-9.]/g, ""));
    let amount = (price || 0) / receiveCurrency.current_price;
    return removeTrailingZeros(amount);
  };

  // Function to handle the amount change
  const handleAmountChange = (e) => {
    // Get the raw input value
    let value = e.target.value;

    if (value === ".") {
      value = "0.";
    }

    // Remove leading zeros and non-numeric chars except for the first decimal point
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      // If there are multiple dots, keep only the first part and the second part separated by a dot
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // If the value is an empty string or only a dot, update the state accordingly and exit
    if (value === "" || value === ".") {
      setAmountToSpend(value);
      return;
    }

    // Check if there is a selected spendCurrency
    if (!spendCurrency) return "";

    // Find the maxAmount for the selected currency
    const maxAmount =
      currentUserData.wallet.find(
        (currency) => spendCurrency.id === currency.id,
      )?.amount || 0;

    // If the input value exceeds maxAmount, ignore it
    const numericValue = parseFloat(value);
    if (numericValue > maxAmount) {
      return;
    }

    // Update the state with the cleaned-up, yet unformatted value, to preserve input behavior
    setAmountToSpend(value);
  };

  // Function to calculate the max sell amount
  const maxSellAmount = () => {
    if (!spendCurrency) return "";
    const maxAmount = currentUserData.wallet.find(
      (currency) => spendCurrency.id === currency.id,
    ).amount;
    return "(Up To ≈ " + maxAmount + ")";
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full md:p-10 md:border rounded-xl dark:border-gray-600 text-lg">
      <div className="w-full max-h-full md:p-5 flex flex-col  justify-between items-start text-xl">
        <div className=" w-full h-full flex flex-col md:gap-10">
          <div className="flex flex-col w-full">
            <label className="font-bold">{t("spend")}</label>
            <Select
              value={spendCurrency}
              className="react-select-container w-full py-5"
              classNamePrefix="react-select"
              placeholder={t("search") + "..."}
              onChange={setSpendCurrency}
              isOptionDisabled={(option) => {
                if (!receiveCurrency) return false;
                return option.id === receiveCurrency.id;
              }}
              isOptionSelected={(option) => {
                if (!spendCurrency) return false;
                return option.id === spendCurrency.id;
              }}
              components={{
                Option: SelectCustomOption,
                SingleValue: CustomSpendValue,
              }}
              options={walletCurrencies}
              isClearable={true}
              isLoading={
                (currencies && currencies.length === 0) || currencies === null
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="font-bold mb-1">{t("amount")}</label>
            <input
              type="text"
              value={amountToSpend}
              className="react-input w-full rounded focus:ring-transparent text-lg"
              onChange={handleAmountChange}
              placeholder={
                spendCurrency ? t("selectAmount") : t("selectCurrencyFirst")
              }
              disabled={!spendCurrency}
            />
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {spendCurrency ? `select amount...${maxSellAmount()}` : ""}
            </div>
          </div>
        </div>
      </div>
      <div>
        <i className="material-icons w-full text-9xl text-custom-teal p-10 h-full flex justify-center items-center">
          currency_exchange
        </i>
      </div>
      <div className="w-full md:p-5 flex flex-col justify-between items-center">
        <div className="flex flex-col w-full">
          <label className="font-bold mb-1">{t("receive")}</label>
          <Select
            value={receiveCurrency}
            className="react-select-container w-full py-5"
            classNamePrefix="react-select"
            placeholder={t("search") + "..."}
            isOptionDisabled={(option) => {
              if (!spendCurrency) return false;
              return option.id === spendCurrency.id;
            }}
            isOptionSelected={(option) => {
              if (!receiveCurrency) return false;
              return option.id === receiveCurrency.id;
            }}
            onChange={(selectedOption) => setReceiveCurrency(selectedOption)}
            components={{
              Option: SelectCustomOption,
              SingleValue: CustomReceiveValue,
            }}
            options={currencies}
            isLoading={
              (currencies && currencies.length === 0) || currencies === null
            }
          />
        </div>
        <button
          onClick={handleTrade}
          disabled={isLoading}
          className={`flex justify-center items-center w-full font-bold bg-custom-teal ${!isLoading && "hover:bg-teal-500"} h-11 rounded`}
        >
          {isLoading ? (
            <div className="loading-container">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          ) : (
            <div>{t("trade")}</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default TradeCurrencyScreen;
