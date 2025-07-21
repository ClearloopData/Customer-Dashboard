'use client';

import React, { useEffect, useRef } from 'react';
import Globe, { GlobeInstance } from 'globe.gl';

interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
}

interface Props {
  points: GlobePoint[];
  blockWidth: number;
  blockHeight: number;
}

export default function SpinningGlobe({ points, blockWidth, blockHeight }: Props) {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // Clear existing Globe instance
    if (globeInstanceRef.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      while (globeRef.current.firstChild) {
        globeRef.current.removeChild(globeRef.current.firstChild);
      }
    }

    const globe = new Globe(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('#3a228a')
      .atmosphereAltitude(0.25)
      .backgroundColor('rgba(0,0,0,0)')
      .width(blockWidth)
      .height(blockHeight);

    globe
      .pointsData(points)
      .pointLat((d: any) => d.lat)
      .pointLng((d: any) => d.lng)
      .pointColor(() => 'white')
      .pointAltitude(() => 0.25)
      .pointLabel((d: any) => d.label)
      .pointRadius(() => 0.7);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    function getSubsolarPoint(date = new Date()): { lat: number; lng: number } {
      const rad = Math.PI / 180;
      const dayOfYear = Math.floor(
        (date.getTime() - new Date(date.getUTCFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
      );
      const decl = 23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * rad);
      const lng = -((date.getUTCHours() + date.getUTCMinutes() / 60) * 15);
      return { lat: decl, lng };
    }

    function getAntipode(coord: { lat: number; lng: number }): { lat: number; lng: number } {
      return {
        lat: -coord.lat,
        lng: ((coord.lng + 180) % 360) - 180,
      };
    }

    function destinationPoint(
      { lat, lng }: { lat: number; lng: number },
      bearingDeg: number,
      distanceDeg: number
    ): { lat: number; lng: number } {
      const rad = Math.PI / 180;
      const φ1 = lat * rad;
      const λ1 = lng * rad;
      const θ = bearingDeg * rad;
      const δ = distanceDeg * rad;

      const φ2 = Math.asin(
        Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
      );

      const λ2 =
        λ1 +
        Math.atan2(
          Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
          Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
        );

      return {
        lat: φ2 / rad,
        lng: ((λ2 / rad + 540) % 360) - 180,
      };
    }

    function makeNightPolygon(
      center: { lat: number; lng: number },
      radiusDeg = 90,
      numPoints = 100
    ): any {
      const coords: [number, number][] = [];
      for (let i = 0; i <= numPoints; i++) {
        const bearing = (360 * i) / numPoints;
        const point = destinationPoint(center, bearing, radiusDeg);
        coords.push([point.lng, point.lat]);
      }

      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
        properties: {},
      };
    }

    function updateNight() {
      const sun = getSubsolarPoint();
      const nightCenter = getAntipode(sun);
      const nightPolygon = makeNightPolygon(nightCenter);
      globe
        .polygonsData([nightPolygon])
        .polygonCapColor(() => 'rgba(0,0,0,0.8)')
        .polygonSideColor(() => 'rgba(0,0,0,0)')
        .polygonStrokeColor(() => 'rgba(0,0,0,0)');
    }

    updateNight();
    intervalRef.current = window.setInterval(updateNight, 60 * 1000);

    globeInstanceRef.current = globe;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      while (globeRef.current?.firstChild) {
        globeRef.current.removeChild(globeRef.current.firstChild);
      }
    };
  }, [points, blockWidth, blockHeight]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div ref={globeRef} />
    </div>
  );
}
