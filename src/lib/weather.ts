const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function getWeatherAtCoords(lat: Number, lon: Number) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }

  const data = await res.json();
  return data;
}



export async function getForecastAtCoords(lat: Number, lon: Number) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    throw new Error(`Forecast API error: ${res.status}`);
  }

  const data = await res.json();
  return data;
}
