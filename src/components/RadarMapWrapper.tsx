// components/RadarMapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const DynamicRadarMap = dynamic(() => import('./RadarMap'), { ssr: false });

export default function RadarMapWrapper({ lat, lon, zoom, coors }: { lat: number, lon: number, zoom: number, coors: any }) {
  return (
    <DynamicRadarMap lat={lat} lon={lon} zoom={zoom} coors={coors} />
  );
}
