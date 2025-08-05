//this file contains much (ideally in the future, all) of the hard-coded data for the dashboard

//mapping project name (as in csv) to its watttime abreviated region (firebase db)
export const project_name_to_region: Record<string, string> = {
    "Arcadia South": "MISO_LOWER_MS_RIVER",
    "Jackson II": "TVA",
    "Panola I": "TVA",
    "Panola II": "TVA",
    "Panola III": "TVA",
    "Paris BPU": "TVA",
    "White Pine": "TVA"
};

//mapping project name (as in csv) to firebase slight renaming
export const project_name_to_firebase_name: Record<string, string> = {
    //"Arcadia South": "MISO_LOWER_MS_RIVER",
    "Jackson II": "jackson",
    "Panola I": "panola1",
    "Panola II": "panola2",
    "Panola III": "panola3",
    "Paris BPU": "paris",
    "White Pine": "whitepine"
};

//mapping project to max wattage (sourced from Clearloop website, not using appropriate formula or data source!)
export const project_name_to_max_mwh: Record<string, number> = {
    //"Arcadia South": "MISO_LOWER_MS_RIVER",
    "Jackson II": 1,
    "Panola I": 4.75,
    "Panola II": 4.75,
    "Panola III": 3.5,
    "Paris BPU": 1,
    "White Pine": 2.8,
    "Arcadia": 0.0 //TODO: update when known
};

//mapping project to its lat and lon
export const project_name_to_lat_lon: Record<string, any> = {

    "Jackson II": { lat: 35.607757, lng: -88.917046, label: "Jackson II"},
    "Panola I": { lat: 34.3041527, lng: -89.98631801, label: "Panola I"},
    "Panola II": { lat: 34.34085632, lng: -89.91117261, label: "Panola II"},
    "Panola III": { lat: 34.302365, lng: -89.987844, label: "Panola II"},
    "Paris BPU": { lat: 36.4463, lng: -88.327083, label: "Paris BPU"},
    "White Pine": { lat: 36.123581, lng: -83.284975, label: "White Pine"},
    "Arcadia": { lat: 32.562749, lng: -92.922857, label: "Arcadia"}

};

export const weather_id_mappings: Record<number, Record<string, string>> = {

    // Group 2xx: Thunderstorm
    200: { desc: "Thunderstorm, light rain", icon: "11d.png" },
    201: { desc: "Thunderstorm, moderate rain", icon: "11d.png" },
    202: { desc: "Thunderstorm, heavy rain", icon: "11d.png" },
    210: { desc: "Light thunderstorm", icon: "11d.png" },
    211: { desc: "Thunderstorm", icon: "11d.png" },
    212: { desc: "Heavy thunderstorm", icon: "11d.png" },
    221: { desc: "Ragged thunderstorm", icon: "11d.png" },
    230: { desc: "Thunderstorm, light drizzle", icon: "11d.png" },
    231: { desc: "Thunderstorm, drizzle", icon: "11d.png" },
    232: { desc: "Thunderstorm, heavy drizzle", icon: "11d.png" },

    // Group 3xx: Drizzle
    300: { desc: "Light drizzle", icon: "09d.png" },
    301: { desc: "Drizzle", icon: "09d.png" },
    302: { desc: "Heavy drizzle", icon: "09d.png" },
    310: { desc: "Light drizzle rain", icon: "09d.png" },
    311: { desc: "Drizzle rain", icon: "09d.png" },
    312: { desc: "Heavy drizzle rain", icon: "09d.png" },
    313: { desc: "Shower rain and drizzle", icon: "09d.png" },
    314: { desc: "Heavy shower rain and drizzle", icon: "09d.png" },
    321: { desc: "Shower drizzle", icon: "09d.png" },

    // Group 5xx: Rain
    500: { desc: "Light rain", icon: "10d.png" },
    501: { desc: "Moderate rain", icon: "10d.png" },
    502: { desc: "Heavy rain", icon: "10d.png" },
    503: { desc: "Very heavy rain", icon: "10d.png" },
    504: { desc: "Extreme rain", icon: "10d.png" },
    511: { desc: "Freezing rain", icon: "13d.png" },
    520: { desc: "Light shower rain", icon: "09d.png" },
    521: { desc: "Shower rain", icon: "09d.png" },
    522: { desc: "Heavy shower rain", icon: "09d.png" },
    531: { desc: "Ragged shower rain", icon: "09d.png" },

    // Group 6xx: Snow
    600: { desc: "Light snow", icon: "13d.png" },
    601: { desc: "Snow", icon: "13d.png" },
    602: { desc: "Heavy snow", icon: "13d.png" },
    611: { desc: "Sleet", icon: "13d.png" },
    612: { desc: "Light shower sleet", icon: "13d.png" },
    613: { desc: "Shower sleet", icon: "13d.png" },
    615: { desc: "Light rain and snow", icon: "13d.png" },
    616: { desc: "Rain and snow", icon: "13d.png" },
    620: { desc: "Light shower snow", icon: "13d.png" },
    621: { desc: "Shower snow", icon: "13d.png" },
    622: { desc: "Heavy shower snow", icon: "13d.png" },

    // Group 7xx: Atmosphere
    701: { desc: "Misty", icon: "50d.png" },
    711: { desc: "Smoky", icon: "50d.png" },
    721: { desc: "Hazy", icon: "50d.png" },
    731: { desc: "Dust whirls", icon: "50d.png" },
    741: { desc: "Foggy", icon: "50d.png" },
    751: { desc: "Sandy", icon: "50d.png" },
    761: { desc: "Dusty", icon: "50d.png" },
    762: { desc: "Volcanic ash", icon: "50d.png" },
    771: { desc: "Squalls", icon: "50d.png" },
    781: { desc: "Tornado", icon: "50d.png" },

    // Group 800: Clear
    800: { desc: "Clear sky", icon: "01d.png" },

    // Group 80x: Clouds
    801: { desc: "Few clouds", icon: "02d.png" },
    802: { desc: "Scattered clouds", icon: "03d.png" },
    803: { desc: "Broken clouds", icon: "04d.png" },
    804: { desc: "Overcast clouds", icon: "04d.png" },
};


export const helpSteps = [
  {
    blockKeys: ["logo"],
    description: "Thank you for partnering with Clearloop! Lets take a tour around the dashboard."
  },
  {
    blockKeys: ["recs"],
    description: "This number is the total number of Renewable Energy Certificates (RECs) that we anticipate your portion of the solar project will earn over its lifetime."
  },
  {
    blockKeys: ["current_mwh", "current_carbon_avoided"],
    description: "These dials show the amount of energy produced and carbon avoided over the last hour."
    
  },
  {
    blockKeys: ["current_mwh"],
    description: "Many factors affect the performance of solar panels, including the current weather, time of day, and time of year. This dial shows the current hourly energy production of your portion of the project."
    
  },
  {
    blockKeys: ["current_carbon_avoided"],
    description: "Clearloop's solar projects create green energy, providing a alternative to fossil-fuel-sourced energy. This dial shows the amount of carbon dioxide emissions that Clearloop avoided over the last hour by generating energy cleanly instead of with fossil fuels."
  },
  {
    blockKeys: ["weather_summary_current", "weather_summary_future", "sunrise_sunset_on_spinning_globe", "radar_visualization",
        "date_and_time", "visibility", "humidity"
    ],
    description: "Many important weather and time-related factors can be monitored here."
  },
  {
    blockKeys: ["cumulative_production", "cumulative_health", "cumulative_carbon_avoided"],
    description: "These fields state the total amount of energy produced, <ask Winston for wording>, and carbon avoided over the lifetime of the project."
  },
  {
    blockKeys: ["historic_mwh", "historic_carbon_avoided"],
    description: "These graphs show the past performance of the project."
  },

  {
    blockKeys: ["community_partnerships"],
    description: "Clearloop prioritizes its relationship with communities in which its solar projects are built. This field outlines recent events that connect Clearloop with the local community."
  },
  {
    blockKeys: ["steps"],
    description: "Click through these fields to learn more about how your collaberation leads to environmental and social good."
  },
  {
    blockKeys: ["solar_panel_layout"],
    description: "Put a face to the name! Here is the solar project that makes everything possible."
  },

  
];
