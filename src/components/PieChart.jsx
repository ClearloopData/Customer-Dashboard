'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Clearloop brand gradient colors
const CLEARLOOP_COLORS = ['#F7E15D', '#787E9B', '#FFFCD1', '#AEB3C4'];

export default function PieChartGraph({
  boxWidth = 400,
  boxHeight = 300,
  data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ],
  colors = CLEARLOOP_COLORS,
  unit = "MWh"
}) {
  // Animation states
  const [animatedWidth, setAnimatedWidth] = useState(boxWidth);
  const [animatedHeight, setAnimatedHeight] = useState(boxHeight);

  useEffect(() => {
    let frame;
    const animate = () => {
      setAnimatedWidth(prev => prev + (boxWidth - prev) * 0.2);
      setAnimatedHeight(prev => prev + (boxHeight - prev) * 0.2);

      if (Math.abs(boxWidth - animatedWidth) > 0.5 || Math.abs(boxHeight - animatedHeight) > 0.5) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [boxWidth, boxHeight]);

  const width = Math.max(50, Math.round(animatedWidth));
  const height = Math.max(50, Math.round(animatedHeight));

  const { cx, cy, innerRadius, outerRadius } = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    return {
      cx,
      cy,
      innerRadius: maxRadius * 0.6,
      outerRadius: maxRadius,
    };
  }, [width, height]);

  /** ✅ Add this transformation: replace non-positive values with 1 so chart always renders */
  const safeData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      value: d.value > 0 ? d.value : 1,
    }));
  }, [data]);

  /** ✅ Use real sum of original data for center label */
  const total = useMemo(() => data.reduce((sum, entry) => sum + entry.value, 0), [data]);
  const formattedTotal = String(total / 100).substring(0, 5);

  // Custom label renderer — use original value for labels
  const renderCustomLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, index } = props;
    const RADIAN = Math.PI / 180;
    const labelRadius = outerRadius + 8;

    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    const entry = data[index];
    const valueFormatted = String(entry.value / 100).substring(0, 5);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.max(width * 0.03, 9)}
      >
        {`${entry.name}: ${valueFormatted} ${unit}`}
      </text>
    );
  };

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <PieChart width={width} height={height}>
        <defs>
          {colors.map((color, index) => (
            <radialGradient
              key={`grad-${index}`}
              id={`grad-${index}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.5} />
            </radialGradient>
          ))}
        </defs>

        <Pie
          data={safeData}   // ✅ use transformed data
          dataKey="value"
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          isAnimationActive={false}
          stroke="none"
          label={renderCustomLabel}
          labelLine={false}
        >
          {safeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#grad-${index % colors.length})`}
            />
          ))}
        </Pie>

        {/* Center label */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fill="white"
        >
          <tspan
            x={cx}
            dy="0"
            fontSize={Math.max(width * 0.08, 12)}
            fontWeight="bold"
          >
            {formattedTotal}
          </tspan>
          <tspan
            x={cx}
            dy="1.2em"
            fontSize={Math.max(width * 0.045, 9)}
          >
            {unit}
          </tspan>
        </text>
      </PieChart>
    </div>
  );
}
