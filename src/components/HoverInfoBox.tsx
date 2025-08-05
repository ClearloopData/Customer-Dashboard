// components/HoverInfoBox.tsx
'use client';

import React, { useState, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  info: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number | string;
};

//see Dashboard.tsx for usage
export default function HoverInfoBox({
  children,
  info,
  delay = 300,
  position = 'top',
  width = 200
}: Props) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block h-full w-full" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div
          className={`absolute z-1000 p-2 rounded shadow-lg text-white bg-black text-m transition-opacity ${positionClasses[position]}`}
          style={{ width }}
        >
          {info}
        </div>
      )}
    </div>
  );
}
