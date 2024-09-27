import React from "react";
import { useTranslation } from "react-i18next";

// This component is used to display the footer
export default function Footer() {
  const { t } = useTranslation(); // Translation function

  return (
    <footer className="flex w-full justify-between items-center bg-white dark:bg-gray-800 text-black dark:text-white p-5 eft-0 right-0 font-semibold">
      <p>&copy; {new Date().getFullYear() + " " + t("rights")}</p>
      <div className="hidden md:flex gap-4 text-lg ">
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
    </footer>
  );
}
