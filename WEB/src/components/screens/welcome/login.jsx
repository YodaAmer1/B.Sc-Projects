import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/icons/logo.png";
import Alert from "../../alert/alert.jsx";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../firebase";

// This component is used to display the login screen
export default function Login() {
  const { t } = useTranslation(); // Translation function
  const [showPassword, setShowPassword] = useState(false); // State to show or hide the password
  const [alertVisible, setAlertVisible] = useState(false); // State to show or hide the alert
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false); // State to track the login process
  const [alertData, setAlertData] = useState({
    // State to store the alert data
    title: "",
    message: "",
    type: "",
  });

  const [loginData, setLoginData] = useState({ email: "", password: "" }); // State to store the login data

  // Function to handle the login process
  const handleSubmit = async (e) => {
    if (!checkFormFields()) return; // Check if the form fields are valid
    setIsLoggingIn(true);
    e.preventDefault(); // Prevent the default form submission
    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password,
      );
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setAlertData({
          ...alertData,
          title: "error",
          message: "errorInvalidCredentials",
          type: "error",
        });
      } else {
        setAlertData({
          ...alertData,
          title: "error",
          message: "somethingWentWrong",
          type: "error",
        });
      }
      showAlert();
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Function to check if the form fields are valid
  function checkFormFields() {
    const { email, password } = loginData;
    if (email === "" || password === "") {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorFillAllFields",
        type: "error",
      });
      showAlert();
      return false;
    }
    if (!checkMial(email)) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorInvalidEmail",
        type: "error",
      });
      showAlert();
      return false;
    }
    return true;
  }

  // Function to check if the email is valid
  function checkMial(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // Function to handle the forgot password process
  const hundleForgotPassword = () => {
    const { email } = loginData;
    if (!checkMial(email)) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorInvalidEmail",
        type: "error",
      });
      showAlert();
      return;
    }
    sendPasswordResetEmail(auth, loginData.email)
      .then(() => {
        setAlertData({
          ...alertData,
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
        <div
          onSubmit={handleSubmit}
          className="flex flex-col justify-center mx-10"
        >
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white">
            {t("logIn")}
          </h1>

          <input
            type="text"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className="mt-10 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("mail")}
          />
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="mt-5 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("password")}
          />

          <div className="flex mt-5 gap-2">
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
            onClick={handleSubmit}
            disabled={isLoggingIn}
            className={`mt-10 h-10 text-gray-800 font-bold px-5 rounded-lg bg-custom-teal ${!isLoggingIn && "hover:bg-teal-500"} flex justify-start items-center`}
          >
            {/* {t("logIn")} */}
            {isLoggingIn ? (
              <div className="loading-container">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            ) : (
              t("logIn")
            )}
          </button>

          <a
            className="mt-5 text-gray-500 dark:text-gray-300 cursor-pointer font-semibold underline"
            onClick={hundleForgotPassword}
          >
            {t("forgotPassword")}
          </a>
        </div>
      </div>
      <Alert
        title={alertData.title}
        message={alertData.message}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
    </div>
  );
}
