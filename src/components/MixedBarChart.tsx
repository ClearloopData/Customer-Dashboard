'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function MixedBarChart({
  data,
  projects,
  boxWidth = 500,
  boxHeight = 300,
  unit="MWh"
}: {
  data: any[],
  projects: string[],
  boxWidth?: number,
  boxHeight?: number,
  unit?:string

}) {

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        width={boxWidth}
        height={boxHeight}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
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
  );
}
