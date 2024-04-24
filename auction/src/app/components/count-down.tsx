"use client";

import React, { useState, useEffect } from "react";

interface ClockProps {
  endTime: number;
}

const Clock: React.FC<ClockProps> = ({ endTime }) => {
  const [days, setDays] = useState<number | null>(null);
  const [hours, setHours] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      if (difference <= 0) {
        clearInterval(interval);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="ml-10 clock__wrapper flex items-center space-x-3">
      <div className="clock__data flex items-center space-x-3">
        <div className="text-center">
          <h1 className="text-lg mb-2">{days}</h1>
          <h5 className="text-sm">Days</h5>
        </div>
        <span className="text-lg">:</span>
      </div>
      <div className="clock__data flex items-center space-x-3">
        <div className="text-center">
          <h1 className="text-lg mb-2">{hours}</h1>
          <h5 className="text-sm">Hours</h5>
        </div>
        <span className="text-lg">:</span>
      </div>
      <div className="clock__data flex items-center space-x-3">
        <div className="text-center">
          <h1 className="text-lg mb-2">{minutes}</h1>
          <h5 className="text-sm">Minutes</h5>
        </div>
        <span className="text-lg">:</span>
      </div>
      <div className="clock__data flex items-center space-x-3">
        <div className="text-center">
          <h1 className="text-lg mb-2">{seconds}</h1>
          <h5 className="text-sm">Seconds</h5>
        </div>
      </div>
    </div>
  );
};

export default Clock;
