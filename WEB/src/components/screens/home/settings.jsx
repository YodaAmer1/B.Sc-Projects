import React, { useEffect, useState } from "react";
import Alert from "../../alert/alert";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/icons/logo.png";
import { auth, deleteUserAccount, updateUserProfile } from "../../../firebase";
import { useAuth } from "../../../AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";

// This component is used to display the Settings screen
const Settings = () => {
  const { t } = useTranslation(); // Translation function

  const { currentUser, currentUserData, fetchUserData } = useAuth(); // Get the current user and user data

  const [alertVisible, setAlertVisible] = useState(false); // State to show or hide the alert
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);
  const [alertData, setAlertData] = useState({
    // State to store the alert data
    title: "",
    message: "",
    messageType: "",
    type: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to show or hide the password

  const [email, setEmail] = useState(currentUser.email || ""); // State to store the email
  const [firstName, setFirstName] = useState(
    currentUser.displayName.split(" ")[0] || "",
  ); // State to store the first name
  const [lastName, setLastName] = useState(
    currentUser.displayName.split(" ")[1] || "",
  ); // State to store the last name
  const [phone, setPhone] = useState(currentUserData.phone || ""); // State to store the phone number
  const [oldPassword, setOldPassword] = useState(""); // State to store the old password
  const [newPassword, setNewPassword] = useState(""); // State to store the new password

  const [updateAccountLoading, setUpdateAccountLoading] = useState(false); // State to track the update account loading status
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false); // State to track the delete account loading status

  // Set the document title when the component mounts
  useEffect(() => {
    document.title = t("settings") + " | " + t("cryptoPulse");

    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  // Function to handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.length > 10) return; // Limit the phone number to 10 digits

    if (value.length === 0) return setPhone(""); // Clear the phone number if the input is empty

    // Block any non-digit characters
    if (!/^\d+$/.test(value)) return;

    setPhone(value);
  };

  // Function to validate the form fields
  const validateForm = () => {
    if (
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      (oldPassword !== "" && newPassword === "") ||
      (oldPassword === "" && newPassword !== "")
    ) {
      setAlertData({
        title: "error",
        message: "errorFillAllFields",
        type: "error",
      });
      showAlert();
    }
    if (oldPassword !== "" && newPassword.length < 6) {
      setAlertData({
        title: "error",
        message: "passwordTooShort",
        type: "error",
      });
      showAlert();
    }

    setAlertData({
      title: "confirmAction",
      message: "confirmUpdateProfile",
      action: updateProfile,
      messageType: "confirm-warnning",
      type: "confirm-warnning",
    });
    showAlert();
  };

  // Function to update the user profile
  const updateProfile = async () => {
    setUpdateAccountLoading(true);
    updateUserProfile(firstName, lastName, phone, oldPassword, newPassword)
      .then(async () => {
        // Update the user profile
        await fetchUserData();
        setAlertData({
          title: "success",
          message: "profileUpdatedSuccessfully",
          type: "success",
        });
        showAlert();
      })
      .catch((error) => {
        // Handle the error
        if (error.message.includes("Re-authentication failed")) {
          // Handle the re-authentication failure specifically
          console.error("Re-authentication failed. Please log in again.");
          setAlertData({
            title: "error",
            message: "errorWrongPassword",
            type: "error",
          });
          showAlert();
        } else {
          // Handle other errors
          console.error("An error occurred:", error.message);
          setAlertData({
            title: "error",
            message: "somethingWentWrong",
            type: "error",
          });
          showAlert();
        }
      })
      .finally(() => {
        setUpdateAccountLoading(false);
      });
  };

  // Function to delete the user account
  const handleDeleteAccount = async () => {
    setDeleteAccountLoading(true);

    try {
      await deleteUserAccount();
    } catch (error) {
      setAlertData({
        title: "error",
        message: "somethingWentWrong",
        type: "error",
      });
      showAlert();
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  // Function to handle the forgot password action
  const hundleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setAlertData({
          title: "success",
          message: "resetPasswordEmailSent",
          type: "success",
        });
        showAlert();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="scrollable-content content">
      <div className="grid md:grid-cols-2 w-full h-full py-5 overflow-y-auto">
        <div className="flex justify-end">
          <img
            src={Logo}
            loading="lazy"
            alt="CryptoPulse logo"
            className="flex max-h-[350px] w-auto md:max-h-[550px] p-5 m-auto"
          />
          <div className="h-full bg-gray-300 dark:bg-gray-600 hidden md:block w-px mx-[10px]" />
        </div>

        <div className="flex flex-col justify-center gap-5 mx-10 ">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white">
            {t("profile")}
          </h1>
          <input
            type="text"
            value={email}
            className="mt-10 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("mail")}
            disabled={true}
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-3 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("firstName")}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full pl-3 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("lastName")}
            />
          </div>
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            className="h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("phone")}
          />
          <div className="flex flex-col gap-1">
            <div className="flex gap-4">
              <input
                type={showPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("oldPassword")}
                autoComplete="new-password"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("newPassword")}
                autoComplete="new-password"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("changePassword")}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="checkbox"
              onClick={() => setShowPassword(!showPassword)}
            />
            <label className="text-gray-800 dark:text-white">
              {t("showPassword")}
            </label>
          </div>

          <button
            type="button"
            onClick={validateForm}
            className={`mt-10 h-10 text-gray-800 font-bold px-5 rounded-lg bg-custom-teal ${!updateAccountLoading && "hover:bg-teal-500"} flex justify-start items-center`}
          >
            {updateAccountLoading ? (
              <div className="loading-container">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            ) : (
              t("updateProfile")
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setAlertData({
                ...alertData,
                title: "confirmAction",
                message: "confirmDeleteAccount",
                action: handleDeleteAccount,
                messageType: "confirm-warnning",
                type: "confirm-warnning",
              });
              showAlert();
            }}
            className={`h-10 text-gray-800 font-bold px-5 rounded-lg bg-red bg-opacity-50 ${!deleteAccountLoading && "hover:bg-opacity-100"} flex justify-start items-center`}
          >
            {deleteAccountLoading ? (
              <div className="loading-container">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            ) : (
              t("deleteAccount")
            )}
          </button>
          <a
            className=" text-gray-500 dark:text-gray-300 cursor-pointer font-semibold underline"
            onClick={hundleForgotPassword}
          >
            {t("forgotPassword")}
          </a>
        </div>
      </div>
      <Alert
        title={alertData.title}
        message={alertData.message}
        messageType={alertData.messageType}
        action={alertData.action}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
    </div>
  );
};

export default Settings;
