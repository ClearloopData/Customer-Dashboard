'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function MixedBarChart({
  data,
  projects,
  boxWidth = 500,
  boxHeight = 300,
  unit = "MWh"
}: {
  data: any[],
  projects: string[],
  boxWidth?: number,
  boxHeight?: number,
  unit?: string
}) {
  // Extract unique years from the data, sorted descending
  const allYears = useMemo(() => {
    const years = new Set<string>();
    data.forEach(entry => {
      if (entry.month) {
        const [year] = entry.month.split('-');
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));  // DESCENDING
  }, [data]);

  // Selected year state
  const [selectedYear, setSelectedYear] = useState<string>("");

  // When years load, set default to most recent
  useEffect(() => {
    if (allYears.length > 0) {
      setSelectedYear(allYears[0]);
    }
  }, [allYears]);

  // Filter data to selected year
  const filteredData = useMemo(() => {
    if (!selectedYear) return [];
    return data.filter(entry => entry.month.startsWith(selectedYear + "-"));
  }, [data, selectedYear]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Year selector */}
      {allYears.length > 1 && (
        <div className="flex items-center justify-end pr-4 mt-2">
          <label className="text-xs mr-2 text-gray-400"></label>
          <select
            className="text-xs bg-neutral-800 border border-gray-700 rounded px-2 py-1"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            onClick={(e) => e.stopPropagation()}  // PREVENT click from bubbling to parent
          >
            {allYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          width={boxWidth}
          height={boxHeight}
          data={filteredData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(month) => String(parseInt(month.split('-')[1], 10))}
            label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
          />

          <YAxis
            label={
              <text
                style={{ fill: '#999', fontSize: 16 }}
                transform="rotate(-90)"
                dy={30}
                dx={-80}
                textAnchor="middle"
              >
                {unit}
              </text>
            }
            tickFormatter={(value) =>
              unit === "lbs (1000s)"
                ? `${(value / 1000).toFixed(0)}`
                : value
            }
          />

          <Tooltip />
          {/* <Legend /> */}
          {projects.map((project, idx) => (
            <Bar
              key={project}
              dataKey={project}
              stackId="a"
              fill={idx % 2 === 0 ? "#F7E15D" : "#787E9B"}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
