import React, { useState, useEffect } from "react";
import Logo from "../../assets/icons/logo.png";
import Usa from "../../assets/icons/usa.png";
import Germany from "../../assets/icons/germany.webp";
import Italy from "../../assets/icons/italy.webp";
import china from "../../assets/icons/china.png";
import Russia from "../../assets/icons/russia.png";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { webSettings } from "../../atoms/webSettings";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./navigationBar.css";
import { useAuth } from "../../AuthContext";
import UserMenu from "../userMenu/userMenu";
import SearchBar from "../searchBar/searchBar";
import { useLocation } from "react-router-dom";
import { setPathLocation } from "../../App";
import Halving from "./halving";
import Alert from "../alert/alert";

// This component is used to display the navigation bar
export default function NavigationBar() {
  const { t } = useTranslation();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false); // State to toggle the theme menu
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false); // State to toggle the language menu
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle the search bar
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State to toggle the user menu
  const [dashboardMenuOpened, setDashboardMenuOpened] = useState(false); // State to toggle the dashboard menu

  const [alertVisible, setAlertVisible] = useState(false); // State to toggle the alert
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const [settings, setSettings] = useRecoilState(webSettings); // Recoil state to store the web settings
  const { currentUser, currentUserData } = useAuth(); // Get the current user and user data
  const [logo, setLogo] = useState(Usa); // State to store the logo of the language website
  const [location, setLocation] = useState(""); // State to store the current location path
  const locationPath = useLocation(); // Get the current location path

  // Array of button identifiers with their respective icons
  const buttons = [
    { title: "coins", icon: "monetization_on" },
    { title: "news", icon: "feed" },
    { title: "transactions-history", icon: "history" },
  ];

  // Array of button identifiers with their respective icons for the dashboard menu
  const dashboardButtons = [
    { title: "cashIn", icon: "shopping_cart" },
    { title: "withdraw", icon: "account_balance" },
  ];

  // Function to handle the sign out of the user
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  // Set the location state based on the current location path
  useEffect(() => {
    const splitedPath = locationPath.pathname.split("/");
    setLocation(splitedPath[splitedPath.length - 1]);
  }, [locationPath]);

  // Set the logo based on the current language
  useEffect(() => {
    switch (i18n.language) {
      case "en":
        setLogo(Usa);
        break;
      case "de":
        setLogo(Germany);
        break;
      case "it":
        setLogo(Italy);
        break;
      case "zh":
        setLogo(china);
        break;
      case "ru":
        setLogo(Russia);
        break;
      default:
        setLogo(Usa);
    }
  }, [i18n.language]);

  // Function to handle the theme change
  function handleThemeChange(theme) {
    setIsThemeMenuOpen(false);

    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setSettings({ ...settings, theme: "light" });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setSettings({ ...settings, theme: "dark" });
    }
  }

  // Function to handle the language change
  function handleLanguageChange(language, logo) {
    setIsLanguageMenuOpen(false);
    i18n.changeLanguage(language);
    setLogo(logo);
  }

  // Function to handle the dashboard menu toggle
  const languageMenuRow = (language, logo) => {
    return (
      <button
        type="button"
        onClick={() => handleLanguageChange(language, logo)}
        className="w-full h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 gap-2"
      >
        <img src={logo} loading="lazy" width={20} height={20} />
        {t(language)}
      </button>
    );
  };

  return (
    <div className="z-10">
      <nav className="flex flex-wrap items-center justify-between mx-auto p-4 bg-gray-100 border-gray-200 dark:bg-gray-900">
        <div
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
          onClick={() => setPathLocation("/home")}
        >
          <img
            src={Logo}
            loading="lazy"
            alt="CryptoPulse logo"
            className="h-8"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {t("cryptoPulse")}
          </span>
        </div>
        <div className="flex md:order-2">
          {!isUserMenuOpen && (location === "coins" || location === "news") && (
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`inline-flex items-center p-2 mr-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
            >
              <i className="material-icons">search</i>
            </button>
          )}

          {currentUser ? (
            <div className="dropdown">
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <i className="material-icons">
                  {isUserMenuOpen ? "close" : "menu"}
                </i>
              </button>
            </div>
          ) : (
            <div className="dropdown">
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <i className="material-icons">
                  {isUserMenuOpen ? "close" : "menu"}
                </i>
              </button>
            </div>
          )}
        </div>

        <Halving />

        <div className="hidden items-center md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse md:flex">
          <div className="dropdown">
            <button
              onClick={() => {
                setIsLanguageMenuOpen(false);
                setIsUserMenuOpen(false);
                setIsThemeMenuOpen(!isThemeMenuOpen);
              }}
              type="button"
              className="material-icons text-black dark:text-white hover:bg-gray-200 p-2 mx-4 hover:rounded-full dark:hover:bg-gray-700"
            >
              {settings.theme === "dark" ? "dark_mode" : "light_mode"}
            </button>

            {isThemeMenuOpen && (
              <div
                className="z-50 my-4 text-base py-2 font-medium list-none bg-white divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2"
                style={{ width: "max-content" }}
              >
                <button
                  onClick={() => handleThemeChange("light")}
                  type="button"
                  className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  style={{ width: "-webkit-fill-available" }}
                >
                  <i className="material-icons mr-2">light_mode</i>
                  {t("lightMode")}
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  type="button"
                  className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  style={{ width: "-webkit-fill-available" }}
                >
                  <i className="material-icons mr-2">dark_mode</i>
                  {t("darkMode")}
                </button>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button
              onClick={() => {
                setIsThemeMenuOpen(false);
                setIsUserMenuOpen(false);
                setIsLanguageMenuOpen(!isLanguageMenuOpen);
              }}
              type="button"
              className="inline-flex items-center font-medium p-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
            >
              <img
                src={logo}
                loading="lazy"
                width={20}
                height={20}
                className="mr-2"
              />
              {/* <i className="material-icons mr-2">translate</i> */}
              {t("languageName")}
              <i className="material-icons">arrow_drop_down</i>
            </button>
            {isLanguageMenuOpen && (
              <div className="z-50 my-4 py-2 font-medium text-base list-none bg-white divide-gray-200 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2 w-max">
                {languageMenuRow("en", Usa)}
                {languageMenuRow("ru", Russia)}
                {languageMenuRow("de", Germany)}
                {languageMenuRow("it", Italy)}
                {languageMenuRow("zh", china)}
              </div>
            )}
          </div>

          {currentUser && currentUserData && (
            <button
              type="button"
              onClick={() => {
                setIsThemeMenuOpen(false);
                setIsLanguageMenuOpen(false);
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className={`flex items-center font-medium p-2 text-sm text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <i className="material-icons mr-2">account_circle</i>
              <span> {currentUser.displayName} </span>
            </button>
          )}

          {!currentUser || !currentUserData ? (
            <div className="space-x-4">
              <button
                onClick={() => setPathLocation("/welcome/signup")}
                className="text-gray-800 px-2 py-2 rounded-xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {t("signUp")}
              </button>
              <button
                onClick={() => setPathLocation("/welcome/login")}
                className="text-gray-800 px-2 py-2 rounded-xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {t("logIn")}
              </button>
            </div>
          ) : null}
        </div>
      </nav>
      <SearchBar isSearchOpen={isSearchOpen} searchData={location} />
      <UserMenu isUserMenuOpen={isUserMenuOpen} />
      {currentUser
        ? isUserMenuOpen && (
            <div
              className="scrollable-content content items-center p-5 absolute md:hidden bg-opacity-5 bg-white font-bold text-black dark:text-white"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex justify-end items-end w-full">
                  <button
                    onClick={() => setPathLocation("/home/settings")}
                    className="material-icons p-1 rounded-full hover:text-gray-500 dark:hover:text-gray-200"
                  >
                    settings
                  </button>
                </div>
                <div className="w-[80%] flex flex-col justify-center items-center gap-4 pb-10">
                  <div className="flex flex-col justify-center items-center gap-3">
                    <i className="material-icons" style={{ fontSize: "100px" }}>
                      account_circle
                    </i>
                    <p>{currentUser && currentUser.displayName}</p>
                  </div>
                  {buttons.map((button) => (
                    <a
                      key={button.title}
                      href={`/home/${button.title}`}
                      className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                      onClick={() => setLocation(button.title)}
                    >
                      <i className="material-icons">{button.icon}</i>
                      {t(button.title)}
                    </a>
                  ))}
                  <div className="w-full flex items-start">
                    <a
                      key={"dashboard"}
                      href={`/home/dashboard`}
                      className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                      onClick={() => setLocation("dashboard")}
                    >
                      <i className="material-icons">dashboard</i>
                      {t("dashboard")}
                    </a>
                    <button
                      onClick={() => {
                        setDashboardMenuOpened(!dashboardMenuOpened);
                      }}
                      className="material-icons"
                    >
                      {dashboardMenuOpened ? "expand_less" : "expand_more"}
                    </button>
                  </div>
                  {dashboardMenuOpened &&
                    dashboardButtons.map((button) => (
                      <a
                        key={button.title}
                        href={`/home/dashboard/${button.title}`}
                        className="flex w-full pl-10 h-10  "
                        onClick={() => setLocation(button.title)}
                      >
                        <div className="w-full flex gap-5 border-b border-gray-400">
                          <i className="material-icons">{button.icon}</i>
                          {t(button.title)}
                        </div>
                      </a>
                    ))}
                  <div className="w-full py-2">
                    <button
                      onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                      className="flex justify-between items-center gap-1"
                    >
                      <i className="material-icons">translate</i>
                      {t("languageName")}
                      <i className="material-icons">expand_more</i>
                    </button>
                    {isLanguageMenuOpen && (
                      <div className="flex flex-col justify-center items-start gap-3 py-2 px-7">
                        <button
                          onClick={() => handleLanguageChange("en", Usa)}
                          className="flex justify-between items-center"
                        >
                          English (US)
                        </button>
                        <button
                          onClick={() => handleLanguageChange("ru", Russia)}
                          className="flex justify-between items-center"
                        >
                          Русский
                        </button>
                        <button
                          onClick={() => handleLanguageChange("de", Germany)}
                          className="flex justify-between items-center"
                        >
                          Deutsch
                        </button>
                        <button
                          onClick={() => handleLanguageChange("it", Italy)}
                          className="flex justify-between items-center"
                        >
                          Italiano
                        </button>
                        <button
                          onClick={() => handleLanguageChange("zh", china)}
                          className="flex justify-between items-center"
                        >
                          中文 (繁體)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="w-full p-5 h-12 flex justify-between items-center bg-gray-300  bg-opacity-20 rounded-lg">
                    {t("darkMode")}

                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.theme === "dark" ? true : false}
                        onChange={(e) =>
                          handleThemeChange(e.target.checked ? "dark" : "light")
                        }
                      />
                      <span className="switch" />
                    </label>
                  </div>
                  <button
                    className="w-full p-5 h-12 flex justify-start items-center bg-gray-300 bg-opacity-20 rounded-lg gap-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                    onClick={showAlert}
                  >
                    <i className="material-icons">logout</i>
                    {t("signOut")}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 text-lg ">
                <a
                  href="https://www.instagram.com"
                  className="fa fa-instagram cursor-pointer p-1 text-fuchsia-400"
                  target="_blank"
                  aria-hidden="true"
                />
                <a
                  href="https://wa.me/972543921507"
                  className="fa fa-whatsapp cursor-pointer p-1 text-green"
                  target="_blank"
                  aria-hidden="true"
                />
                <a
                  href="https://www.facebook.com"
                  className="fa fa-facebook-official cursor-pointer p-1 text-blue-500"
                  target="_blank"
                  aria-hidden="true"
                />
              </div>
            </div>
          )
        : isUserMenuOpen && (
            <div
              className="scrollable-content content h-full items-center p-5 absolute md:hidden bg-white dark:bg-gray-700 font-bold text-black dark:text-white"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                "--tw-bg-opacity": "0.5",
              }}
            >
              <div className="flex flex-col justify-start items-center h-full w-full">
                <div className="w-[80%] flex flex-col justify-center items-center gap-4 py-10">
                  <a
                    href="/welcome/login"
                    className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                  >
                    <i className="material-icons">login</i>
                    {t("login")}
                  </a>
                  <a
                    href="/welcome/signup"
                    className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                  >
                    <i className="material-icons">edit</i>
                    {t("signup")}
                  </a>

                  <div className="w-full py-2">
                    <button
                      onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                      className="flex justify-between items-center gap-1"
                    >
                      <i className="material-icons">translate</i>
                      {t("languageName")}
                      <i className="material-icons">expand_more</i>
                    </button>
                    {isLanguageMenuOpen && (
                      <div className="flex flex-col justify-center items-start gap-3 py-2 px-7">
                        <button
                          onClick={() => handleLanguageChange("en", Usa)}
                          className="flex justify-between items-center"
                        >
                          English (US)
                        </button>
                        <button
                          onClick={() => handleLanguageChange("ru", Russia)}
                          className="flex justify-between items-center"
                        >
                          Русский
                        </button>
                        <button
                          onClick={() => handleLanguageChange("de", Germany)}
                          className="flex justify-between items-center"
                        >
                          Deutsch
                        </button>
                        <button
                          onClick={() => handleLanguageChange("it", Italy)}
                          className="flex justify-between items-center"
                        >
                          Italiano
                        </button>
                        <button
                          onClick={() => handleLanguageChange("zh", china)}
                          className="flex justify-between items-center"
                        >
                          中文 (繁體)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="w-full p-5 h-12 flex justify-between items-center bg-gray-300  bg-opacity-20 rounded-lg">
                    {t("darkMode")}

                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.theme === "dark" ? true : false}
                        onChange={(e) =>
                          handleThemeChange(e.target.checked ? "dark" : "light")
                        }
                      />
                      <span className="switch" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-lg ">
                <a
                  href="https://www.instagram.com"
                  className="fa fa-instagram cursor-pointer p-1 text-fuchsia-400"
                  target="_blank"
                  aria-hidden="true"
                />
                <a
                  href="https://wa.me/972543921507"
                  className="fa fa-whatsapp cursor-pointer p-1 text-green"
                  target="_blank"
                  aria-hidden="true"
                />
                <a
                  href="https://www.facebook.com"
                  className="fa fa-facebook-official cursor-pointer p-1 text-blue-500"
                  target="_blank"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
      {/* {isUserMenuOpen && currentUser && (
        <div
          className="scrollable-content content items-center p-5 absolute md:hidden bg-opacity-5 bg-white font-bold text-black dark:text-white"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex justify-end items-end w-full">
              <button
                onClick={() => setPathLocation("/home/settings")}
                className="material-icons p-1 rounded-full hover:text-gray-500 dark:hover:text-gray-200"
              >
                settings
              </button>
            </div>
            <div className="w-[80%] flex flex-col justify-center items-center gap-4 pb-10">
              <div className="flex flex-col justify-center items-center gap-3">
                <i className="material-icons" style={{ fontSize: "100px" }}>
                  account_circle
                </i>
                <p>{currentUser && currentUser.displayName}</p>
              </div>
              {buttons.map((button) => (
                <a
                  key={button.title}
                  href={`/home/${button.title}`}
                  className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                  onClick={() => setLocation(button.title)}
                >
                  <i className="material-icons">{button.icon}</i>
                  {t(button.title)}
                </a>
              ))}
              <div className="w-full flex items-start">
                <a
                  key={"dashboard"}
                  href={`/home/dashboard`}
                  className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                  onClick={() => setLocation("dashboard")}
                >
                  <i className="material-icons">dashboard</i>
                  {t("dashboard")}
                </a>
                <button
                  onClick={() => {
                    setDashboardMenuOpened(!dashboardMenuOpened);
                  }}
                  className="material-icons"
                >
                  {dashboardMenuOpened ? "expand_less" : "expand_more"}
                </button>
              </div>
              {dashboardMenuOpened &&
                dashboardButtons.map((button) => (
                  <a
                    key={button.title}
                    href={`/home/dashboard/${button.title}`}
                    className="flex w-full pl-10 h-10  "
                    onClick={() => setLocation(button.title)}
                  >
                    <div className="w-full flex gap-5 border-b border-gray-400">
                      <i className="material-icons">{button.icon}</i>
                      {t(button.title)}
                    </div>
                  </a>
                ))}
              <div className="w-full py-2">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex justify-between items-center gap-1"
                >
                  <i className="material-icons">translate</i>
                  {t("languageName")}
                  <i className="material-icons">expand_more</i>
                </button>
                {isLanguageMenuOpen && (
                  <div className="flex flex-col justify-center items-start gap-3 py-2 px-7">
                    <button
                      onClick={() => handleLanguageChange("en", Usa)}
                      className="flex justify-between items-center"
                    >
                      English (US)
                    </button>
                    <button
                      onClick={() => handleLanguageChange("ru", Russia)}
                      className="flex justify-between items-center"
                    >
                      Русский
                    </button>
                    <button
                      onClick={() => handleLanguageChange("de", Germany)}
                      className="flex justify-between items-center"
                    >
                      Deutsch
                    </button>
                    <button
                      onClick={() => handleLanguageChange("it", Italy)}
                      className="flex justify-between items-center"
                    >
                      Italiano
                    </button>
                    <button
                      onClick={() => handleLanguageChange("zh", china)}
                      className="flex justify-between items-center"
                    >
                      中文 (繁體)
                    </button>
                  </div>
                )}
              </div>
              <div className="w-full p-5 h-12 flex justify-between items-center bg-gray-300  bg-opacity-20 rounded-lg">
                {t("darkMode")}

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.theme === "dark" ? true : false}
                    onChange={(e) =>
                      handleThemeChange(e.target.checked ? "dark" : "light")
                    }
                  />
                  <span className="switch" />
                </label>
              </div>
              <button
                className="w-full p-5 h-12 flex justify-start items-center bg-gray-300 bg-opacity-20 rounded-lg gap-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={showAlert}
              >
                <i className="material-icons">logout</i>
                {t("signOut")}
              </button>
            </div>
          </div>
          <div className="flex gap-4 text-lg ">
            <a
              href="https://www.instagram.com"
              className="fa fa-instagram cursor-pointer p-1 text-fuchsia-400"
              target="_blank"
              aria-hidden="true"
            />
            <a
              href="https://wa.me/972543921507"
              className="fa fa-whatsapp cursor-pointer p-1 text-green"
              target="_blank"
              aria-hidden="true"
            />
            <a
              href="https://www.facebook.com"
              className="fa fa-facebook-official cursor-pointer p-1 text-blue-500"
              target="_blank"
              aria-hidden="true"
            />
          </div>
        </div>
      )} */}
      <Alert
        title={"signOutTitle"}
        message={"signOutMessage"}
        messageType={"confirm-warnning"}
        action={handleSignOut}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
    </div>
  );
}
