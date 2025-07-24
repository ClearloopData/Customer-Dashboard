// components/Dashboard.tsx
import useWindowSize from '@/app/dashboard/useWindowSize';
import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import PieSlice from '@/components/PieSlice';
import dynamic from 'next/dynamic';
import RadarMapWrapper from '@/components/RadarMapWrapper';
import DateTimeBlock from '@/components/DateTimeBlock';
import MixedBarChart from '@/components/MixedBarChart';
import {project_name_to_max_mwh} from '@/components/projectData';

//import Dial from '@/components/Dial'; 

const Dial = dynamic(() => import('@/components/Dial'), { ssr: false });
const PieChartGraph = dynamic(() => import('@/components/PieChart'), { ssr: false });



const SpinningGlobe = dynamic(() => import('@/components/SpinningGlobe'), {
  ssr: false
});



const ASPECT_RATIO = 4/2.25;

const weather_id_mappings: Record<number, Record<string, string>> = {

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


//store all blocks that will be dynamically placed given screen width
const blocks:any = {

    logo: {
        block: <div className='h-full'><div className="flex justify-center items-center space-x-1">
                <img src="/rivian_logo.png" width={60} alt="Rivian Logo" />X
                <img src="/clearloop_infinity_white.png" width={60} alt="Clearloop Logo" />
            </div>
            <h2 className='text-sm'>#RECS</h2>
            </div>,
        coor: { 9: [0, 0], 6: [0, 0], 4: [0, 0] },
        width: { 9: 1, 6: 1, 4: 1 },
        height: { 9: 1, 6: 1, 4: 1 },
    },

    recs: {
        block: <div><p>recs</p></div>,
        coor: { 9: [1, 0], 6: [1, 0], 4: [1, 0] },
        width: { 9: 1, 6: 1, 4: 1 },
        height: { 9: 1, 6: 1, 4: 1 },
    },
    date_and_time: {
        block: <div><h2>Date and time</h2></div>,
        coor: { 9: [2, 0], 6: [2, 0], 4: [2, 0] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 1, 6: 1, 4: 1 },
    },
    weather_summary_current: {
        block: <div><h2>Weather Summary (current)</h2></div>,
        coor: { 9: [4, 0], 6: [4, 0], 4: [0, 7] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 1, 6: 1, 4: 1 },
    },
    weather_summary_future: {
        block: <div><h2>Weather Summary (future)</h2></div>,
        coor: { 9: [4, 1], 6: [4, 1], 4: [0, 9] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 2, 6: 2, 4: 2 },
    },

    community_partnerships: {
        block: <div><h2>Community partnerships (TODO)</h2></div>,
        coor: { 9: [6, 0], 6: [3, 12], 4: [0, 23] },
        width: { 9: 3, 6: 3, 4: 4 },
        height: { 9: 3, 6: 2, 4: 2 },
    },

    steps: {
        block: <div><h2>step 1</h2></div>,
        coor: { 9: [6, 3], 6: [3, 10], 4: [0, 21] },
        width: { 9: 3, 6: 3, 4: 4 },
        height: { 9: 3, 6: 2, 4: 2 },
    },

    sunrise_sunset_on_spinning_globe: {
        block: <div></div>,
        coor: { 9: [2, 1], 6: [2, 1], 4: [2, 1] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 3, 6: 3, 4: 3 },
    },

    radar_visualization: {
        block: <div>

        </div>,
        coor: { 9: [4, 3], 6: [4, 3], 4: [2, 7] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 3, 6: 3, 4: 4 },
    },

    current_mwh: {
        block: <div><p>current MWh output per project</p></div>,
        coor: { 9: [0, 1], 6: [0, 1], 4: [0, 1] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 3, 6: 3, 4: 3 },
    },

    current_carbon_avoided: {
        block: <div><p>current carbon avoided</p></div>,
        coor: { 9: [0, 4], 6: [0, 4], 4: [0, 4] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 3, 6: 3, 4: 3 },
    },

    cumulative_production: {
        block: <div><p>cumulative_production</p></div>,
        coor: { 9: [2, 4], 6: [2, 4], 4: [2, 4] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 1, 6: 1, 4: 1 },
    },

    cumulative_health: {
        block: <div><p>current health</p></div>,
        coor: { 9: [2, 5], 6: [2, 5], 4: [2, 5] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 1, 6: 1, 4: 1 },
    },

    cumulative_carbon_avoided: {
        block: <div><p>carbon avoided</p></div>,
        coor: { 9: [2, 6], 6: [2, 6], 4: [2, 6] },
        width: { 9: 2, 6: 2, 4: 2 },
        height: { 9: 1, 6: 1, 4: 1 },
    },

    visibility: {
        block: <div><p>visibility</p></div>,
        coor: { 9: [4, 6], 6: [4, 6], 4: [0, 8] },
        width: { 9: 1, 6: 1, 4: 1 },
        height: { 9: 1, 6: 1, 4: 1 },
    },

    humidity: {
        block: <div><p>humidity</p></div>,
        coor: { 9: [5, 6], 6: [5, 6], 4: [1, 8] },
        width: { 9: 1, 6: 1, 4: 1 },
        height: { 9: 1, 6: 1, 4: 1 },
    },

    historic_mwh: {
        block: <div><p>historic MHw (month), all time</p></div>,
        coor: { 9: [0, 7], 6: [0, 7], 4: [0, 11] },
        width: { 9: 3, 6: 3, 4: 4 },
        height: { 9: 3, 6: 3, 4: 3 },
    },

    historic_carbon_avoided: {
        block: <div><p>historic carbon avoided (month), all time</p></div>,
        coor: { 9: [3, 7], 6: [3, 7], 4: [0, 14] },
        width: { 9: 3, 6: 3, 4: 4 },
        height: { 9: 3, 6: 3, 4: 3 },
    },

    solar_panel_layout: {
        block: 
        <div>
            <h2 className='text-xs flex justify-left pl-4 pt-2 pb-4'>Project Layout</h2>
        </div>,
        coor: { 9: [6, 6], 6: [0, 10], 4: [0, 17] },
        width: { 9: 3, 6: 3, 4: 4 },
        height: { 9: 4, 6: 4, 4: 4 },
    },
}


function calc_coordinate_dimension_system(screen_width: number) {
    if(screen_width >= 1200) return [9,10];
    if(screen_width >= 800) return [6,14];
    return [4,25];
}

function calc_unit_and_space_width(screen_width: number, num_units_wide: number) {

    //2.5% gap - 95% block - 2.5% gap
    let each_width = screen_width / num_units_wide;

    let unitWidth = each_width*0.90;
    let unitHeight = unitWidth/ASPECT_RATIO;
    let spaceWidth = each_width*0.05;


    return {
        unitWidth: unitWidth,
        unitHeight: unitHeight,
        spaceWidth: spaceWidth
    }

}

function get_x(x_coor: number, unit_width: number, space_width: number) {

    return x_coor * (2*space_width + unit_width);

}

function get_y(y_coor: number, unit_height: number, space_width: number) {

    return y_coor * (2*space_width + unit_height);

}

function get_width_or_height(coor_width: number, unit_width: number, space_width: number) {

    return (coor_width * unit_width) + ((coor_width-1) * space_width * 2);

}

// generates rgb string (spanning red to green) given a capacity value
function capacityToColor(capacity: number) {
    capacity = Math.min(Math.max(capacity, 0), 1);

    let r, g;

    if (capacity < 0.5) {
        r = 255;
        g = Math.round(255 * (capacity / 0.5));
    } else {
        g = 255;
        r = Math.round(255 * (1 - (capacity - 0.5) / 0.5));
    }

    return `rgb(${r}, ${g}, 0)`;
}

//function for historical data for bar chart
function prepareHistoricalData(stats: any) {
  if (!stats?.historical || !stats?.projects) return [];

  const projects = stats.projects;
  const allMonthsSet = new Set();

  // Collect all months from all projects
  for (const proj of projects) {
    const projHist = stats.historical?.[proj] ?? {};
    for (const year of Object.keys(projHist)) {
      for (const month of Object.keys(projHist[year])) {
        allMonthsSet.add(`${year}-${month.padStart(2,"0")}`);
      }
    }
  }

  const allMonths = Array.from(allMonthsSet).sort();

  // Build array of data points
  const data = allMonths.map((monthKey: any) => {
    const [year, month] = monthKey.split("-");
    const entry: any = { month: monthKey };

    for (const proj of projects) {
      const value = stats.historical?.[proj]?.[year]?.[month]?.mwh ?? 0;
      entry[proj] = Number(value.toFixed(2));
    }

    return entry;
  });

  return data;
}


function prepareHistoricalCO2Data(stats: any) {
  if (!stats?.historical || !stats?.projects) return [];

  const projects = stats.projects;
  const allMonthsSet = new Set();

  // Collect all months from all projects
  for (const proj of projects) {
    const projHist = stats.historical?.[proj] ?? {};
    for (const year of Object.keys(projHist)) {
      for (const month of Object.keys(projHist[year])) {
        allMonthsSet.add(`${year}-${month.padStart(2,"0")}`);
      }
    }
  }

  const allMonths = Array.from(allMonthsSet).sort();

  // Build array of data points
  const data = allMonths.map((monthKey: any) => {
    const [year, month] = monthKey.split("-");
    const entry: any = { month: monthKey };

    for (const proj of projects) {
      const value = stats.historical?.[proj]?.[year]?.[month]?.co2 ?? 0;
      entry[proj] = Number(value.toFixed(2));
    }

    return entry;
  });

  return data;
}


function calculateForecastHourLabel(forecastUtcSeconds: number) {
  if (!forecastUtcSeconds) return "";

  const nowUtcSeconds = Math.floor(Date.now() / 1000);

  let diffHours = Math.round((forecastUtcSeconds - nowUtcSeconds) / 3600);

  if (diffHours < 0) diffHours = 0;

  return `${diffHours}h`;
}

function formatDecimal(unformatted_num: string) {

    const cost_string = unformatted_num;
    const cost_string_parsed = cost_string.split('.');
    const dollar_string = cost_string_parsed[0];
    //commas
    let dollar_string_commas = "";
    for(let i=dollar_string.length-1; i>=0; i--) {

        if((i)%3==0 && i!=0) {
            dollar_string_commas = "," + dollar_string_commas;
        }


        dollar_string_commas = dollar_string[i] + dollar_string_commas;

        
    }
    const cent_string = cost_string_parsed[1] ?? "00";
    const cost_to_display = dollar_string_commas + "." + cent_string.substring(0, 2);

    return cost_to_display;

}




export default function Dashboard({ stats }: { stats: any }) {

    //states
    const [weatherProjectIndex, setWeatherProjectIndex] = useState(0);
    const [selectedSiteIndex, setSelectedSiteIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);



    const { width, height } = useWindowSize();

    //get coordinate-system dimensions of dashboard, given screen width
    const coordinate_system = calc_coordinate_dimension_system(width);

    //get the width, height, and spacing (in pixels) of a given unit, given screen width (and coor system)
    const important_dimensions = calc_unit_and_space_width(width, coordinate_system[0]);
    const unit_width = important_dimensions.unitWidth;
    const unit_height = important_dimensions.unitHeight;
    const space_width = important_dimensions.spaceWidth;

    //compute block pixel location, other attributes, etc, then add to list
    const renderedBlocks: any = [];

    for(let block in blocks) {

        //get coordinates (given coordinate system)
        let coors = blocks[block].coor[coordinate_system[0]];
        let coor_width = blocks[block].width[coordinate_system[0]];
        let coor_height = blocks[block].height[coordinate_system[0]];

        //location variables
        let x = get_x(coors[0], unit_width, space_width);
        let y = get_y(coors[1], unit_height, space_width);
        let blockWidth = Math.round(get_width_or_height(coor_width, unit_width, space_width));
        let blockHeight = Math.round(get_width_or_height(coor_height, unit_height, space_width));


        //conditional attributes
        


        if (block === "logo") {
            if (stats) {
                blocks[block].block = (
                <div>
                    <div className="h-full w-full flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center space-x-1">
                        <img src="/rivian_logo.png" width={60} alt="Rivian Logo" />
                        <span className="text-lg">X</span>
                        <img src="/clearloop_infinity_white.png" width={60} alt="Clearloop Logo" />
                        </div>
                    </div>
                </div>
                );
            }
        }

        if(block === "recs") {

            if(stats)
    

                blocks[block].block = (
                    <div>
                        <div className="h-full w-full flex flex-col items-center justify-center">
                            <h2 className="text-xs mb-1 pt-1">Total RECs</h2>
                            <p className="text-l font-bold" style={{ color: "#F7E15D" }}>{stats.total.RECs.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                );
        }


        //date and time
        if(block === "date_and_time") {
            if(coordinate_system[0] == 4)
                blocks[block].block = <div><DateTimeBlock x_coor_system={coordinate_system[0]}/></div>;
            }

        if (block === "sunrise_sunset_on_spinning_globe") {

            if(stats)
            blocks[block].block = <div>
                    <div>
                        <h2 className='text-xs flex justify-left pl-4 pt-2'>Remaining Daylight</h2>
                        <SpinningGlobe points={ stats["coors"] } blockWidth={blockWidth} blockHeight={blockHeight*0.9}/>
                    </div>
                </div>
        }

        //current weather
        if (block === "weather_summary_current") {

            const projects = stats?.projects || [];
            const weatherData = stats?.weatherData || {};
            const currentProject = projects[selectedSiteIndex % projects.length];


            const weather = weatherData[currentProject];

            

            if (weather) {

                const weather_icon_str = "/" + weather_id_mappings[weather.id].icon;
                const weather_desc = weather_id_mappings[weather.id].desc;

                if(coordinate_system[0] == 4) {
                    blocks[block].block = (
                    <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}

                    >

                        <div className="flex flex-col justify-start pl-4 pt-4 gap-0.5">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-bold">{Math.round(weather.temperature)}°F</h2>

                                {/* Tooltip wrapper */}
                                <div className="relative group">
                                    <img
                                        src={weather_icon_str}
                                        width={28}
                                        className="inline-block"
                                    />
                                    <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {weather_desc}
                                    </div>
                                </div>
                                <h2 className="text-sm text-left">{currentProject}</h2>
                            </div>

                        </div>

                        
                    </div>
                    );
                } else {
                    blocks[block].block = (
                    <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}

                    >

                        <div className="flex flex-col justify-start pl-4 pt-4 gap-0.5">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-bold">{Math.round(weather.temperature)}°F</h2>

                                {/* Tooltip wrapper */}
                                <div className="relative group">
                                    <img
                                        src={weather_icon_str}
                                        width={28}
                                        className="inline-block"
                                    />
                                    <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {weather_desc}
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                        <h2 className="text-sm text-left pl-4">{currentProject}</h2>
                        
                    </div>
                    );
                }
            } else {
                blocks[block].block = (
                <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}

                >
                    Loading weather...
                </div>
                );
            }
        }

        //weather forecast
        if (block === "weather_summary_future") {
            const projects = stats?.projects || [];
            const forecastData = stats?.weatherForcastData || {};
            const currentProject = projects[selectedSiteIndex % projects.length];

            const forecastList = forecastData[currentProject] || [];

            if (forecastList.length > 0) {
                const displayCount = Math.min(8, forecastList.length);
                const slicedForecast = forecastList.slice(0, displayCount);

                blocks[block].block = (
                <div>
                    <div
                        className="h-full w-full p-4 cursor-pointer flex items-center justify-center"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                        {slicedForecast.map((forecast: any, index: number) => {
                            const icon = weather_id_mappings[forecast.id]?.icon || "01d.png";
                            const desc = weather_id_mappings[forecast.id]?.desc || "Clear";

                            return (
                            <div key={index} className="flex flex-col items-center">
                                <img
                                src={"/" + icon}
                                width={28}
                                className="inline-block mb-0"
                                alt={desc}
                                />
                                <p className="text-sm font-bold">{Math.round(forecast.temperature)}°F</p>
                                <p className="text-[10px] text-gray-400 text-center">
                                {calculateForecastHourLabel(forecast.dt)}
                                </p>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
                );
            } else {
                blocks[block].block = (
                <div
                    className="p-4 cursor-pointer flex items-center justify-center h-full"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                >
                    Loading forecast...
                </div>
                );
            }
        }



        //radar vis
        if(block === "radar_visualization") {

            if(stats) {

                blocks[block].block = 
                <div>
                    <RadarMapWrapper
                    lat={35.5}
                    lon={-89.5}
                    zoom={4}
                    coors={stats.coors}
                    />
                </div>
            }
        }

        //current MWh output per project
        if (block === "current_mwh") {
            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];
            const siteStats = stats?.[currentProject];

            const shrink_factor = coordinate_system[0] === 4 ? 0.8 : 0.9;
            const dialWidth = blockWidth * shrink_factor;
            const dialHeight = blockHeight * shrink_factor;

            if (siteStats) {
                const mwhValue = siteStats["Energy Production (MWh)"];
                const percent = siteStats["Capacity (%)"];
                const dialPercent = Math.min(percent, 1); 

                blocks[block].block = (
                <div
                    className="p-4 cursor-pointer flex flex-col items-center"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                >
                    <h2 className='text-xs flex justify-left pl-4 pt-2 pb-4'>Current MWh Production: {currentProject}</h2>
                    <Dial
                    percent={dialPercent}
                    label={`${mwhValue.toFixed(2)} MWh`}
                    boxWidth={dialWidth}
                    boxHeight={dialHeight}
                    />
                </div>
                );
            } else {
                blocks[block].block = (
                <div className="p-4">Loading...</div>
                );
            }
        }


        //current MWh output per project
        if (block === "current_carbon_avoided") {
            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];
            const siteStats = stats?.[currentProject];

            const shrink_factor = coordinate_system[0] === 4 ? 0.8 : 0.9;
            const dialWidth = blockWidth * shrink_factor;
            const dialHeight = blockHeight * shrink_factor;

            if (siteStats) {
                const carbonValue = siteStats["Carbon Avoided (lbs)"];
                const percent = siteStats["Capacity (%)"];
                const dialPercent = Math.min(percent, 1); 
            

                blocks[block].block = (
                <div
                    className="p-4 cursor-pointer flex flex-col items-center"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                >
                    <h2 className='text-xs flex justify-left pl-4 pt-2 pb-4'>Carbon Avoided (hour): {currentProject}</h2>
                    <Dial
                    percent={dialPercent}
                    label={`${carbonValue.toFixed(2)} lbs/hour`}
                    boxWidth={dialWidth}
                    boxHeight={dialHeight}
                    />
                </div>
                );
            } else {
                blocks[block].block = (
                <div className="p-4">Loading...</div>
                );
            }
        }

        const step_font_size = unit_height < 75 ? 1 : 1.25;
        if (block === "steps") {
        const steps = [
            {
            title: "Step 1: Solar Farm Energy Production",
            content: `Depending on the time of day, weather, and many other factors, the solar farm production is gathered and reported. ${
                stats ? stats.total.name : "<company>"
            }'s portion of Clearloop projects is currently producing ${
                stats ? String(stats.total["Energy Production (MWh)"]).substring(0, 5) : 0
            } megawatts per hour.`,
            },
            {
            title: "Step 2: Marginal Emissions",
            content: `Using data from WattTime, Clearloop calculates the marginal emissions. Marginal emissions are the rate at which emissions would change with a small change to electricity load (like turning on a light switch). The marginal emissions rate is currently ${
                stats ? stats.total["moer"] : 0
            } lbs of carbon offset/MWh.`,
            },
            {
            title: "Step 3: Carbon Offset",
            content: `The CO2 emissions offset by the solar farm are calculated by multiplying together the marginal emissions rate and the energy production. For a more accurate estimate, the marginal emissions data is acquired every 5 minutes. The carbon reclaimed from ${
                stats ? stats.total.name : "<company>"
            }'s portion of Clearloop production this hour is approximately ${
                stats ? String(stats.total["Carbon Avoided (lbs)"]).substring(0, 6) : 0
            } lbs per hour.`,
            },
            {
            title: "Step 4: Health Benefits Provided",
            content: `Seven million people per year die from air pollution. Fossil-fueled power plants emit pollutants that damage health like sulfur dioxide. These pollutants cause people living close to power plants to experience higher rates of health problems, such as asthma, heart disease, strokes, and premature death. ${
                stats ? stats.total.name : "<company>"
            } has prevented approximately $${stats ? formatDecimal(String(stats.total["health"])) : "0.00"} of damage to human health during the last hour.`,
            },
        ];

        const currentStep = steps[currentStepIndex];

        blocks[block].block = (
            <div
            className="p-4 cursor-pointer"
            onClick={() => setCurrentStepIndex((prev) => (prev + 1) % steps.length)}
            >
            <h2
                className="flex text-xl font-bold justify-left pl-4 pt-4"
                style={{ color: "#F7E15D" }}
            >
                {currentStep.title}
            </h2>
            <p
                className="flex text-left pl-4 pt-2 text-sm"
                style={{ fontSize: `${step_font_size}rem` }}
            >
                {currentStep.content}
            </p>
            </div>
        );
        }

        

        //steps
        // const step_font_size = unit_height < 75 ? 0.70 : 0.85;
        // if(block === "step1") {
        //     blocks[block].block = <div>
        //         <h2 className='flex text-xl font-bold justify-left pl-4 pt-4' style={{color:"#AEB3C4"}}>Step 1: Solar Farm Energy Production</h2>
        //         <p className='flex text-left pl-4 pt-2 text-sm' style={{ fontSize: `${step_font_size}rem` }}>Depending on the time of day, weather, and many other factors, the solar farm production is gathered and reported. {stats ? stats.total.name : "<company>"}'s portion of Clearloop projects is currently producing {stats ? String(stats.total["Energy Production (MWh)"]).substring(0, 5) : 0} megawatts per hour. 
        //         </p>
        //     </div>

        // }
        // if(block === "step2") {
        //     blocks[block].block = <div>
        //         <h2 className='flex text-xl font-bold justify-left pl-4 pt-4' style={{color:"#AEB3C4"}}>Step 2: Marginal Emissions</h2>
        //         <p className='flex text-left pl-4 pt-2 text-sm' style={{ fontSize: `${step_font_size}rem` }}>Using data from WattTime, Clearloop calculates the marginal emissions. Marginal emissions are the rate at which emissions would change with a small change to electricity load (like turning on a light switch). The marginal emissions rate is currently {stats ? stats.total["moer"] : 0} lbs of carbon offset/MWh.</p>
        //     </div>
        // }
        // if(block === "step3") {
        //     blocks[block].block = <div>
        //         <h2 className='flex text-xl font-bold justify-left pl-4 pt-4' style={{color:"#AEB3C4"}}>Step 3: Carbon Offset</h2>
        //         <p className='flex text-left pl-4 pt-2 text-sm' style={{ fontSize: `${step_font_size}rem` }}>The CO2 emissions offset by the solar farm are calculated by multiplying together the marginal emissions rate and the energy production. For a more accurate estimate, the marginal emissions data is acquired every 5 minutes. The carbon reclaimed from {stats ? stats.total.name : "<company>"}'s portion of Clearloop production this hour is approximately {stats ? String(stats.total["Carbon Avoided (lbs)"]).substring(0,6) : 0} lbs per hour.</p>
        //     </div>
        // }
        // if(block === "step4") {

        //     let cost_string = ""
        //     if(stats) {
        //         cost_string = String(stats.total["health"]);
        //     } else {
        //         cost_string = "0.0";
        //     }
            
        //     const cost_string_parsed = cost_string.split('.');
        //     const dollar_string = cost_string_parsed[0];
        //     const cent_string = cost_string_parsed[1];
        //     const cost_to_display = dollar_string + "." + cent_string.substring(0,2);
        //     blocks[block].block = <div>
        //         <h2 className='flex text-xl font-bold justify-left pl-4 pt-4' style={{color:"#AEB3C4"}}>Step 4: Health Benefits Provided</h2>
        //         <p className='flex text-left pl-4 pt-2 text-sm' style={{ fontSize: `${step_font_size}rem` }}>Seven million people per year from air pollution. Fossil-fueled power plants emit pollutants that damage health like sulfur dioxide. These pollutants cause people living close to power plants to experience higher rates of health problems, such as asthma, heart disease, strokes, and premature death. {stats ? stats.total.name : "<company>"} has prevented approximately ${cost_to_display} of damage to human health during the last hour.</p>
        //     </div>
        // }

        if (block === "visibility") {
            const projects = stats?.projects || [];
            const weatherData = stats?.weatherData || {};
            const currentProject = projects[selectedSiteIndex % projects.length];

            const visibilityValue = weatherData[currentProject]?.visibility ?? "N/A";

            if(blockHeight > 75) {

                blocks[block].block = (
                    <div
                        className="p-4 cursor-pointer flex flex-col items-start"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                        <h2 className="text-xs font-bold mb-1 pt-2">Visibility</h2>
                        <p className="text-2xl font-bold" style={{ color: "#F7E15D" }}>{visibilityValue} ft</p>
                        <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
            } else {

                blocks[block].block = (
                    <div
                        className="p-4 cursor-pointer flex flex-col items-start"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                        <h2 className="text-xs mb-1 pt-1">Visibility</h2>
                        <p className="text-l font-bold" style={{ color: "#F7E15D" }}>{visibilityValue} ft</p>
                        <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
            }
        }


        if (block === "humidity") {
            const projects = stats?.projects || [];
            const weatherData = stats?.weatherData || {};
            const currentProject = projects[selectedSiteIndex % projects.length];

            const humidityValue = weatherData[currentProject]?.humidity ?? "N/A";

            if(blockHeight > 75) {

                blocks[block].block = (
                    <div
                        className="p-4 cursor-pointer flex flex-col items-start"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                        <h2 className="text-xs font-bold mb-1 pt-2">Humidity</h2>
                        <p className="text-2xl font-bold" style={{ color: "#F7E15D" }}>{humidityValue}%</p>
                        <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
            } else {

                blocks[block].block = (
                    <div
                        className="p-4 cursor-pointer flex flex-col items-start"
                        onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                        <h2 className="text-xs mb-1 pt-1">Humidity</h2>
                        <p className="text-l font-bold" style={{ color: "#F7E15D" }}>{humidityValue}%</p>
                        <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );

            }
        }

        if (block === "historic_mwh") {
            const historicalData = useMemo(() => {
                if (stats) {
                return prepareHistoricalData(stats);
                }
                return [];
            }, [stats]);

            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];

            if (stats) {
                blocks[block].block = 
                <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                >
                    <h2 className='text-xs flex justify-left pl-4 pt-2'>Historic MWh Production: {currentProject}</h2>
                    <MixedBarChart
                        data={historicalData}
                        projects={[currentProject]}
                        boxWidth={blockWidth}
                        boxHeight={Math.round(blockHeight * 0.9)}
                        unit={"MWh"}
                    />
                </div>
            } else {
                blocks[block].block = <div>Loading...</div>
            }
        }



        if (block === "historic_carbon_avoided") {
            const historicalCO2Data = useMemo(() => {
                if (stats) {
                return prepareHistoricalCO2Data(stats);
                }
                return [];
            }, [stats]);

            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];

            if(stats) {
                blocks[block].block = 
                <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                >
                    <h2 className='text-xs flex justify-left pl-4 pt-2'>Historic Carbon Avoided: {currentProject}</h2>
                    <MixedBarChart
                        data={historicalCO2Data}
                        projects={[currentProject]}
                        boxWidth={blockWidth}
                        boxHeight={Math.round(blockHeight)}
                        unit={"lbs (1000s)"}
                    />
                </div>
            }
        }

        
        if (block === "cumulative_health") {
            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];

            if (stats) {
                const cost_string = String(stats.historical?.total?.[currentProject]?.health ?? "0.00");
                const cost_string_parsed = cost_string.split('.');
                const dollar_string = cost_string_parsed[0];
                const cent_string = cost_string_parsed[1];
                const comma_dollar_string = String(Number(dollar_string).toLocaleString('en-US'));
                
                const cost_to_display = comma_dollar_string + "." + cent_string.substring(0, 2);

                if (blockHeight > 75) {
                blocks[block].block = (
                    <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                    <h2 className="text-xs font-bold mb-1 pt-2">Saved Healthcare Costs</h2>
                    <p className="text-2xl font-bold" style={{ color: "#F7E15D" }}>${cost_to_display}</p>
                    <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
                } else {
                blocks[block].block = (
                    <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                    <h2 className="text-xs mb-1 pt-1">Saved Healthcare Costs</h2>
                    <p className="text-l font-bold" style={{ color: "#F7E15D" }}>${cost_to_display}</p>
                    <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
                }
            } else {
                blocks[block].block = (
                <div className="p-4">Loading...</div>
                );
            }
        }

        if (block === "cumulative_production") {
            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];

            if (stats) {
                const cost_string = String(stats.historical?.total?.[currentProject]?.mwh ?? "0.00");
                const cost_string_parsed = cost_string.split('.');
                const dollar_string = cost_string_parsed[0];
                const cent_string = cost_string_parsed[1];
                const comma_dollar_string = String(Number(dollar_string).toLocaleString('en-US'));
                
                const cost_to_display = comma_dollar_string + "." + cent_string.substring(0, 2);

                if (blockHeight > 75) {
                blocks[block].block = (
                    <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                    <h2 className="text-xs font-bold mb-1 pt-2">Cumulative Production</h2>
                    <p className="text-2xl font-bold" style={{ color: "#F7E15D" }}>{cost_to_display} MWh</p>
                    <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
                } else {
                blocks[block].block = (
                    <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                    <h2 className="text-xs mb-1 pt-1">Cumulative Production</h2>
                    <p className="text-l font-bold" style={{ color: "#F7E15D" }}>{cost_to_display} MWh</p>
                    <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
                }
            } else {
                blocks[block].block = (
                <div className="p-4">Loading...</div>
                );
            }
        }

        if (block === "cumulative_carbon_avoided") {
            const projects = stats?.projects || [];
            const currentProject = projects[selectedSiteIndex % projects.length];

            if (stats) {
                const cost_string = String(stats.historical?.total?.[currentProject]?.co2 ?? "0.00");
                const cost_string_parsed = cost_string.split('.');
                const dollar_string = cost_string_parsed[0];
                const cent_string = cost_string_parsed[1];
                const comma_dollar_string = String(Number(dollar_string).toLocaleString('en-US'));
                
                const cost_to_display = comma_dollar_string + "." + cent_string.substring(0, 2);

                if (blockHeight > 75) {
                blocks[block].block = (
                    <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                    <h2 className="text-xs font-bold mb-1 pt-2">Cumulative Carbon Avoided</h2>
                    <p className="text-2xl font-bold" style={{ color: "#F7E15D" }}>{cost_to_display} lbs</p>
                    <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
                } else {
                blocks[block].block = (
                    <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedSiteIndex((prev) => (prev + 1) % projects.length)}
                    >
                    <h2 className="text-xs mb-1 pt-1">Cumulative Carbon Avoided</h2>
                    <p className="text-l font-bold" style={{ color: "#F7E15D" }}>{cost_to_display} lbs</p>
                    <p className="text-xs text-gray-400">{currentProject}</p>
                    </div>
                );
                }
            } else {
                blocks[block].block = (
                <div className="p-4">Loading...</div>
                );
            }
        }

        

        if(block === "solar_panel_layout") {

            blocks[block].block = (

                 <div>
                    <div className='w-full'>
                        <h2 className='text-xs flex justify-left pl-4 pt-2'>Project Layout</h2>
                        <img src="/placeholder_solar_panel_layout.png" alt="Rivian Logo" className='rounded-3xl p-4'/>
                    </div>
                </div>

            )
        }




        
        
        //set these attributes
        const styledDiv = React.cloneElement(blocks[block].block, {
            key: block,

            style: {

                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${blockWidth}px`,
                height: `${blockHeight}px`,
                margin: `${space_width}px`,
                color: 'rgb(234, 234, 239)',

            },
            

            className: "rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200"

        });

        //add final div
        renderedBlocks.push(styledDiv);

    }

    
    return <div style={{ background: "rgb(0, 0, 0)", height: `${get_width_or_height(coordinate_system[1], unit_height, space_width) + space_width * 2}px` }} className='relative shadow font-azo'>{renderedBlocks}</div>;

}