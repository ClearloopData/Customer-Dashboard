'use client';

import React, { useState, useEffect } from 'react';

type Props = {
  x_coor_system: number;
};

export default function DateTimeBlock({ x_coor_system }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if(x_coor_system == 4) {
      return (
      <div className="flex flex-col items-start justify-start pl-4 pt-4 w-full h-full">
        <h2 className="text-l font-bold">{formattedTime}</h2>
        <h2 className="text-sm">{formattedDate}</h2>
      </div>
      );
  }

  return (
    <div className="flex flex-col items-start justify-start pl-4 pt-4 w-full h-full">
      <h2 className="text-xl font-bold">{formattedTime}</h2>
      <h2 className="text-sm">{formattedDate}</h2>
    </div>
  );
}
