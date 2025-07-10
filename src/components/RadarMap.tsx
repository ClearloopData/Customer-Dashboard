'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Clearloop Icon
const clearloopIcon = L.icon({
  iconUrl: '/clearloop_infinity_white.png',
  iconSize: [40, 30],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: ''
});

export default function RadarMap({
  lat = 37.7749,
  lon = -122.4194,
  zoom = 5,
  coors = []
}) {
  const [mounted, setMounted] = useState(false);
  const [radarTime, setRadarTime] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(res => res.json())
      .then(data => {
        const frames = data.radar?.past || [];
        if (frames.length) {
          setRadarTime(frames[frames.length - 1].time);
        }
      });
  }, []);

  // Prevent SSR error
  if (!mounted) return null;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: '0.75rem',
    }}>
      <MapContainer
        center={[lat, lon]}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Base Dark Map */}
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          zIndex={1}
        />

        {/* Cloud Cover Layer from OpenWeatherMap */}
        <TileLayer
          opacity={0.4}
          zIndex={5}
          attribution='&copy; OpenWeatherMap'
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=ed191c23444c0fb62ca1d17b0d87ca7b`}
        />

        {/* Transparent Radar Overlay */}
        {radarTime && (
          <TileLayer
            opacity={0.6}
            url={`https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/2/1_0.png`}
            zIndex={10}
          />
        )}

        {/* Multiple Markers with Popup Labels */}
        {coors.map((coor, idx) => (
          <Marker
            key={idx}
            position={[coor.lat, coor.lng]}
            icon={clearloopIcon}
          >
            <Popup>
              <span style={{ color: 'black' }}>{coor.label}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
