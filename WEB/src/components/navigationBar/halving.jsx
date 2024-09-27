import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Halving() {
  const { t } = useTranslation();
  const [timerData, setTimerData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;
    const countDown = new Date("April 21, 2024 18:01:00 UTC").getTime();

    if (countDown < new Date().getTime()) {
      setTimerData({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDown - now;

      const days = Math.floor(distance / day);
      const hours = Math.floor((distance % day) / hour);
      const minutes = Math.floor((distance % hour) / minute);
      const seconds = Math.floor((distance % minute) / second);

      if (distance < 0) {
        clearInterval(timer);
        setTimerData({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimerData({ days, hours, minutes, seconds });
    }, second);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (
    timerData.days === 0 &&
    timerData.hours === 0 &&
    timerData.minutes === 0 &&
    timerData.seconds === 0
  )
    return null;

  return (
    <div className="text-black dark:text-white hidden justify-start items-center lg:order-2 rtl:space-x-reverse xl:flex">
      <img
        className="mr-2"
        src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
        loading="lazy"
        width={20}
        height={20}
      />
      <div className="flex justify-start items-center font-semibold w-[300px]">
        {t("bitcoinHalving") + ": "}
        <h1 className="ml-2">
          {timerData.days +
            "D " +
            timerData.hours +
            "H " +
            timerData.minutes +
            "M " +
            timerData.seconds +
            "S"}
        </h1>
      </div>
    </div>
  );
}
