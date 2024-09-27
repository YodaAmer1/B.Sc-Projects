import React from "react";
import { useTranslation } from "react-i18next";
import ParticlesBackground from "../../particlesBackground.jsx";
import Footer from "../../footer.jsx";

// This component is used to display the Welcome screen
export default function Welcome() {
  const { t } = useTranslation(); // Translation function
  return (
    <div className="text-slate-950 dark:text-white content">
      <ParticlesBackground />
      <div className="h-full w-full flex flex-col justify-center items-center ">
        <div className="text-center absolute opacity-80">
          <h1 className="mb-5 text-6xl font-thin">{t("welcomeTo")}</h1>
          <h1 className="mb-5 text-8xl font-bold">{t("cryptoPulse")}</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}
