import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/icons/logo.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Alert from "../../alert/alert.jsx";
import { auth } from "../../../firebase";
import { createNewUser } from "../../../firebase.js";

// This component is used to display the signup screen
export default function Signup() {
  const { t } = useTranslation(); // Translation function
  const [alertVisible, setAlertVisible] = useState(false); // State to show or hide the alert
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);
  const [alertData, setAlertData] = useState({
    // State to store the alert data
    title: "",
    message: "",
    type: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to show or hide the password

  const [formData, setFormData] = useState({
    // State to store the form data
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // State to track the signup process

  // Function to handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.length > 10) return; // Limit the phone number to 10 digits

    if (value.length === 0) return setFormData({ ...formData, phone: "" }); // Clear the phone number if the input is empty

    // Block any non-digit characters
    if (!/^\d+$/.test(value)) return;

    setFormData({ ...formData, phone: value });
  };

  // Function to handle the signup process
  const handleSignUpSubmit = async (e) => {
    if (!checkFormFields()) return; // Check if the form fields are valid

    setLoading(true);
    e.preventDefault(); // Prevent the default form submission
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      ).then(async (userCredential) => {
        const user = userCredential.user;
        // Update the user's profile
        await updateProfile(user, {
          displayName: formData.firstName + " " + formData.lastName,
        });

        // create a new user document in Firestore
        await createNewUser(user, formData);
      });

      setAlertData({
        ...alertData,
        title: "success",
        message: "accountCreated",
        type: "success",
      });
      showAlert();
    } catch (error) {
      console.log(error);
      // showAlert();
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the form fields are valid
  function checkFormFields() {
    const email = formData.email;
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const phone = formData.phone;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (
      email === "" ||
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
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

    if (password !== confirmPassword) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorPasswordsDoNotMatch",
        type: "error",
      });
      showAlert();
      return false;
    }

    if (password.length < 6) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "passwordTooShort",
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
            {t("signUp")}
          </h1>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-10 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("mail")}
          />
          <div className="flex flex-row w-full">
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full mr-2 pl-3 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("firstName")}
            />
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full ml-2 pl-3 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("lastName")}
            />
          </div>
          <input
            autoComplete="off"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("phone")}
          />
          <div className="flex flex-row w-full">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full mr-2 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("password")}
            />
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full ml-2 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("confirmPassword")}
            />
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
            onClick={handleSignUpSubmit}
            className={`mt-10 h-10 text-gray-800 font-bold px-5 rounded-lg bg-custom-teal ${!loading && "hover:bg-teal-500"} flex justify-start items-center`}
          >
            {loading ? (
              <div className="loading-container">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            ) : (
              t("signUp")
            )}
          </button>
        </div>
      </div>
      <Alert
        title={alertData.title}
        message={alertData.message}
        action={alertData.action}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
    </div>
  );
}
