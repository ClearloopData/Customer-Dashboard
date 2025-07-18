'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;

// Your new gradient color stops
const GRADIENT_COLORS = [
  [94, 74, 227],    // #5E4AE3
  [110, 235, 131],  // #6EEB83
  [255, 188, 66],   // #FFBC42
];

function interpolateColor(color1, color2, t) {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function getTargetAngle(percent) {
  return 180 * (1 - (percent / 2));
}

function getColorForValue(t) {
  // Split t across the number of gradient stops
  const n = GRADIENT_COLORS.length - 1;
  const scaledT = t * n;
  const index = Math.min(Math.floor(scaledT), n - 1);
  const localT = scaledT - index;

  return interpolateColor(GRADIENT_COLORS[index], GRADIENT_COLORS[index + 1], localT);
}

function createGradientData(numSegments) {
  return Array.from({ length: numSegments }, (_, i) => {
    const t = i / (numSegments - 1);
    return {
      name: `segment-${i}`,
      value: 1,
      color: getColorForValue(t),
    };
  });
}

const Needle = ({ angle, cx, cy, iR, oR }) => {
  const length = (iR + 2 * oR) / 3;
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <g transform={`rotate(${180 - angle}, ${x0}, ${y0})`}>
      <circle cx={x0} cy={y0} r={r} fill="white" stroke="black" strokeWidth="2" />
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="black"
        strokeWidth="1"
        fill="white"
      />
    </g>
  );
};

/**
 * Main Dial Component
 *
 * @param {number} percent - a value between 0 and 1
 * @param {string} label - label text under the dial
 * @param {number} boxWidth - chart width in px
 * @param {number} boxHeight - chart height in px
 */
export default function Dial({ percent = 0.7, label = '', boxWidth = 300, boxHeight = 300 }) {
  const [animatedAngle, setAnimatedAngle] = useState(180);

  const diameter = Math.min(boxWidth, boxHeight);
  const iR = diameter * 0.3;
  const oR = diameter * 0.45;
  const cx = boxWidth / 2;
  const cy = boxHeight / 2;

  const NUM_SEGMENTS = 100;
  const gradientData = useMemo(() => createGradientData(NUM_SEGMENTS), []);

  useEffect(() => {
    const targetAngle = getTargetAngle(percent);

    let current = 180;
    let animationFrame;

    const animate = () => {
      const diff = targetAngle - current;
      if (Math.abs(diff) < 0.2) {
        setAnimatedAngle(targetAngle);
        return;
      }
      current += diff * 0.05;
      setAnimatedAngle(current);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [percent]);

  return (
    <PieChart width={boxWidth} height={boxHeight}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={gradientData}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        stroke="none"
        isAnimationActive={false}
      >
        {gradientData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>

      <Needle angle={animatedAngle} cx={cx} cy={cy} iR={iR} oR={oR} />

      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={Math.max(boxWidth * 0.06, 12)}
        fill="white"
        fontWeight="bold"
      >
        {label}
      </text>

      {/* <text
        x={cx}
        y={cy + 45}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={Math.max(boxWidth * 0.05, 10)}
        fill="white"
      >
        
      </text> */}
    </PieChart>
  );
}

