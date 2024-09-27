import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import CreditCardForm from "../../../../creditCard/creditCardForm";
import { removeTrailingZeros } from "../../../../../../public/publicFunctions";
import { addCryptoToTheWallet } from "../../../../../firebase";

// This component is used to display the buy currency screen
const BuyCurrencyScreen = ({
  currencies, // List of available currencies
  currentUser, // Current user data
  currentUserData, // Current user data
  fetchUserData, // Function to fetch user data
  alert, // Function to display an alert
}) => {
  const { t } = useTranslation(); // Translation function

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const [price, setPrice] = useState(""); // Price state
  const [selectedCurrency, setSelectedCurrency] = useState(); // Selected currency state
  const [creditCardDetails, setCreditCardDetails] = useState({
    // Credit card details state
    cardNumber: "",
    cardName: "",
    expDate: "",
    ccv: "",
  });

  // Function to handle the credit card data
  const handleCreditCardData = (data) => {
    setCreditCardDetails(data);
  };

  // Function to validate the form fields
  function validateFormFields() {
    if (!selectedCurrency) {
      alert({
        title: "error",
        message: "errorSelectCurrency",
      });
      return;
    }
    if (!price) {
      alert({
        title: "error",
        message: "errorEnterAmount",
      });
      return;
    }

    if (creditCardDetails.cardNumber.length !== 19) {
      alert({
        title: "error",
        message: "errorInvalidCardNumber",
      });
      return false;
    }
    if (creditCardDetails.cardName === "") {
      alert({
        title: "error",
        message: "errorInvalidCardName",
      });
      return false;
    }
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear().toString().slice(2, 4);

    const expDate = creditCardDetails.expDate.split("/");
    // Check if the expiration date is valid
    if (
      creditCardDetails.expDate.length !== 5 ||
      parseInt(expDate[1]) < year ||
      (parseInt(expDate[0]) <= month && parseInt(expDate[1]) == parseInt(year))
    ) {
      alert({
        title: "error",
        message: "errorInvalidExpDate",
      });
      return false;
    }
    if (creditCardDetails.ccv.length !== 3) {
      alert({
        title: "error",
        message: "errorInvalidCCV",
      });
      return false;
    }
    return true;
  }

  // Function to handle the buy process
  async function handleBuy() {
    if (!validateFormFields()) {
      return;
    }
    setIsLoading(true);
    const value = price.replace(/[^0-9.]/g, "");
    const amount = (parseFloat(value) || 0) / selectedCurrency.current_price;

    // Calculate the account balance
    let accountBalance = selectedCurrency.current_price * amount;
    currentUserData.wallet.forEach((currency) => {
      const currencyPrice = currencies.find(
        (c) => c.id === currency.id,
      ).current_price;
      accountBalance += currency.amount * currencyPrice;
    });
    try {
      // Add the crypto to the wallet
      await addCryptoToTheWallet(
        currentUserData,
        selectedCurrency,
        parseFloat(amount),
        parseFloat(value),
        creditCardDetails,
        accountBalance,
      );
      fetchUserData(currentUser);
      alert({
        title: "success",
        message: "successBuyCrypto",
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
      setPrice("");
      setSelectedCurrency(null);
      setCreditCardDetails({
        cardNumber: "",
        cardName: "",
        expDate: "",
        ccv: "",
      });
    }
  }

  // Handle change in input
  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    let cleaned = input.replace(/[^\d\s]/g, ""); // Remove all non-numeric characters

    // Add a space after every 4 digits
    let value = cleaned
      .replace(/[^0-9]+/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setCreditCardDetails({ ...creditCardDetails, cardNumber: value });
  };

  // Handle change in input
  const handleExpDateChange = (e) => {
    let value = e.target.value.replace(/[^0-9]+/g, ""); // Keep only digits

    if (value.length === 1 && parseInt(value) > 1) {
      // Automatically add a leading zero
      value = "0" + value;
    }

    if (value.length === 2 && parseInt(value) > 12) {
      // Prevent month from being greater than 12
      value = value.substring(0, 1);
    }

    // Automatically add a slash after the month (first two digits)
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    // Handle case when user backspaces over the slash
    if (value.length === 3 && e.target.value.length === 2) {
      value = value.substring(0, 2);
    }

    setCreditCardDetails({ ...creditCardDetails, expDate: value });
  };

  // Custom option component for the currency select
  const CustomOption = ({ innerProps, isFocused, isSelected, data }) => (
    <div
      {...innerProps}
      className={`text-sm flex justify-between items-center p-2 ${isFocused && "bg-gray-300 dark:bg-gray-600"} ${isSelected && "font-bold text-custom-teal"}`}
    >
      <div className="flex justify-start h-full items-center">
        <img
          className="w-6 h-6 mr-2"
          loading="lazy"
          src={data.image}
          alt={data.label + " Logo"}
        />
        <div className="flex flex-col justify-center items-start">
          {data.symbol.toUpperCase()}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.label}
          </span>
        </div>
      </div>
      {isSelected && <i className="material-icons">done</i>}
    </div>
  );

  // Custom single value component for the currency select
  const CustomSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {"≈ " + currencyAmount() + " " + data.symbol.toUpperCase()}
    </div>
  );

  // Function to calculate the amount of the selected currency
  const currencyAmount = () => {
    if (!selectedCurrency) return 0;
    const value = price.replace(/[^0-9.]/g, "");
    let amount = (parseFloat(value) || 0) / selectedCurrency.current_price;
    return removeTrailingZeros(amount);
  };

  // Handle change in input
  const handlePriceChange = (e) => {
    if (e.target.value === "$") {
      setPrice("");
      return;
    }
    // Remove non-numeric chars (except for decimal point)
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Remove all non-numeric characters

    if (value === "") {
      setPrice("");
      return;
    }

    // Check if the value is a valid number
    if (parseFloat(value) > 20000) {
      return;
    }

    // Format the number with commas
    const formattedNumber = parseFloat(value).toLocaleString("en-US");

    // Update the numeric state (convert string to float)
    setPrice("$" + (formattedNumber || 0));
  };

  // Function to display the credit card form for small screens
  function creditCardFormForSmallScreens() {
    return (
      <div className="">
        <label className="font-bold">{t("cardNumber")}</label>
        <input
          type="text"
          value={creditCardDetails.cardNumber}
          className="react-input w-full rounded focus:ring-transparent text-lg"
          onChange={handleCardNumberChange}
          placeholder="1234 1234 1234 1234"
          maxLength="19"
        />
        <label className="font-bold">{t("cardHolder")}</label>
        <input
          type="text"
          value={creditCardDetails.cardName}
          className="react-input w-full rounded focus:ring-transparent text-lg"
          placeholder="Safa Khier"
          onChange={(e) =>
            setCreditCardDetails({
              ...creditCardDetails,
              cardName: e.target.value.toUpperCase(),
            })
          }
        />
        <div className="flex gap-5 w-full">
          <div className="w-full">
            <label className="font-bold">{t("expDate")}</label>
            <input
              type="text"
              value={creditCardDetails.expDate}
              className="react-input w-full rounded focus:ring-transparent text-lg"
              onChange={handleExpDateChange}
              placeholder="10/25"
              maxLength="5"
            />
          </div>
          <div className="w-full">
            <label className="font-bold">{t("cvv")}</label>
            <input
              type="text"
              value={creditCardDetails.ccv}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  ccv: e.target.value.replace(/[^0-9]+/g, ""),
                })
              }
              className="react-input w-full rounded focus:ring-transparent text-lg"
              maxLength="3"
              placeholder="123"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-2 h-full w-full xl:p-10 xl:border rounded-xl dark:border-gray-600">
      <div className="w-full max-h-full md:p-5 flex flex-col justify-between items-start text-xl">
        <div className="text-lg w-full h-full flex flex-col gap-10">
          <div className="flex flex-col w-full">
            <label className="font-bold mb-1">{t("spend")}</label>
            <input
              type="text"
              value={price}
              className="react-input w-full rounded focus:ring-transparent text-lg"
              onChange={handlePriceChange}
              placeholder="$0 - $20,000"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="font-bold">{t("receive")}</label>
            <Select
              value={selectedCurrency}
              className="react-select-container w-full"
              classNamePrefix="react-select"
              placeholder={t("search") + "..."}
              isOptionSelected={(option) => {
                if (!selectedCurrency) return false;
                return option.id === selectedCurrency.id;
              }}
              onChange={(selectedOption) => setSelectedCurrency(selectedOption)}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
              }}
              options={currencies}
              isLoading={!currencies}
            />
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={isLoading}
          className={`hidden xl:flex justify-center items-center w-full font-bold bg-custom-teal ${!isLoading && "hover:bg-teal-500"} h-14 rounded`}
        >
          {isLoading ? (
            <div className="loading-container">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          ) : (
            t("buy")
          )}
        </button>
      </div>
      <div className="p-14 hidden md:flex">
        <CreditCardForm
          handleCreditCardData={handleCreditCardData}
          hiddenBackground={false}
          disabledFields={false}
          cardDetails={creditCardDetails}
        />
      </div>
      <div className="flex flex-col md:hidden mt-10">
        <label className="font-bold text-xl mb-5">
          {t("creditCardDetails")}
        </label>
        {creditCardFormForSmallScreens()}
      </div>
      <button
        onClick={handleBuy}
        disabled={isLoading}
        className={`flex justify-center items-center xl:hidden w-full font-bold bg-custom-teal ${!isLoading && "hover:bg-teal-500"} mt-10 h-11 rounded`}
      >
        {isLoading ? (
          <div className="loading-container">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        ) : (
          t("buy")
        )}
      </button>
    </div>
  );
};

export default BuyCurrencyScreen;
