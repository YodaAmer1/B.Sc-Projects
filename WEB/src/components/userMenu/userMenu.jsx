import React, { useState, useEffect } from "react";
import "./userMenu.css"; // Import your stylesheet
import { useAuth } from "../../AuthContext";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase";
import { setPathLocation } from "../../App";
import Alert from "../alert/alert";

// This component is used to display the user menu
const UserMenu = ({ isUserMenuOpen }) => {
  const [showMenu, setShowMenu] = useState(isUserMenuOpen); // State to show or hide the menu
  const [animateOut, setAnimateOut] = useState(false); // State to animate the menu
  const { currentUser } = useAuth(); // Get the current user
  const { t } = useTranslation(); // Translation function

  const [alertVisible, setAlertVisible] = useState(false); // State to show or hide the alert
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const [dashboardMenuOpened, setDashboardMenuOpened] = useState(false); // State to show or hide the dashboard menu

  // Update the menu when the user menu is opened or closed
  useEffect(() => {
    if (!isUserMenuOpen && showMenu) {
      // Trigger slide-out animation before removing the component
      setAnimateOut(true);
      setTimeout(() => setShowMenu(false), 500); // Match animation duration
    } else if (isUserMenuOpen && !showMenu) {
      setShowMenu(true);
      setAnimateOut(false);
    }
  }, [isUserMenuOpen, showMenu]);

  // Function to hide the menu
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  if (!showMenu || !currentUser) return null;

  return (
    <div className="overflow-hidden">
      <div
        className={`h-[calc(100vh-86px)] hidden md:flex flex-col justify-start right-0 items-center m-2 py-5 rounded-2xl absolute bg-white bg-opacity-5 border border-gray-200 dark:border-gray-600 min-w-96 font-bold text-black dark:text-white ${animateOut ? "slide-out-right" : "slide-in-right"}`}
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex justify-end items-end w-full pr-5">
          <button
            onClick={() => setPathLocation("/home/settings")}
            className="material-icons p-1 rounded-full hover:text-gray-500 dark:hover:text-gray-200"
          >
            settings
          </button>
        </div>

        <div className="w-[75%] h-full flex flex-col justify-between items-center gap-4">
          <div className="flex flex-col justify-center items-center gap-3">
            <i className="material-icons" style={{ fontSize: "100px" }}>
              account_circle
            </i>
            <p>{currentUser.displayName}</p>
          </div>

          <div className="flex flex-col justify-start items-start w-full h-full py-10 gap-3">
            <button
              onClick={() => setPathLocation("/home/coins")}
              className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-opacity-30 dark:hover:bg-opacity-50 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md"
            >
              <i className="material-icons">monetization_on</i>
              <p>{t("coins")}</p>
            </button>
            <button
              onClick={() => setPathLocation("/home/news")}
              className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-opacity-30 dark:hover:bg-opacity-50 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md"
            >
              <i className="material-icons">feed</i>
              <p>{t("news")}</p>
            </button>
            <button
              onClick={() => setPathLocation("/home/transactions-history")}
              className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-opacity-30 dark:hover:bg-opacity-50 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md"
            >
              <i className="material-icons">history</i>
              <p>{t("transactions-history")}</p>
            </button>
            <div className="w-full flex">
              <button
                onClick={() => setPathLocation("/home/dashboard")}
                className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-opacity-30 dark:hover:bg-opacity-50 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md"
              >
                <i className="material-icons">dashboard</i>
                <p>{t("dashboard")}</p>
              </button>
              <button
                onClick={() => {
                  setDashboardMenuOpened(!dashboardMenuOpened);
                }}
                className="material-icons"
              >
                {dashboardMenuOpened ? "expand_less" : "expand_more"}
              </button>
            </div>
            {dashboardMenuOpened && (
              <div className="w-full flex flex-col pl-5 gap-3">
                <button
                  onClick={() => {
                    setPathLocation("/home/dashboard/cashin");
                  }}
                  className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 hover:bg-opacity-30 dark:hover:bg-opacity-50 rounded-t-md"
                >
                  <i className="material-icons">shopping_cart</i>
                  <p>{t("cashIn")}</p>
                </button>
                <button
                  onClick={() => {
                    setPathLocation("/home/dashboard/withdraw");
                  }}
                  className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 hover:bg-opacity-30 dark:hover:bg-opacity-50 rounded-t-md"
                >
                  <i className="material-icons">account_balance</i>
                  <p>{t("withdraw")}</p>
                </button>
              </div>
            )}
          </div>

          <button
            className="w-full p-5 h-12 flex justify-start items-center bg-gray-300 dark:bg-gray-800 rounded-lg gap-2 hover:bg-gray-400 dark:hover:bg-gray-900"
            onClick={showAlert}
          >
            <i className="material-icons">logout</i>
            {t("signOut")}
          </button>
        </div>
      </div>
      <div className="absolute">
        <Alert
          title={"signOutTitle"}
          message={"signOutMessage"}
          messageType={"confirm-warnning"}
          action={handleSignOut}
          isVisible={alertVisible}
          onClose={hideAlert}
        />
      </div>
    </div>
  );
};

export default UserMenu;
