'use client';

/*

IMPORT STATEMENTS

*/

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { signOut } from 'firebase/auth';
import { auth, database } from '@/lib/firebase'; 
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import Papa from 'papaparse';
import Image from 'next/image';
import { signInToSharedDB } from '@/lib/firebase';
import { getWeatherAtCoords, getForecastAtCoords } from '@/lib/weather';
import RadarMap from '@/components/RadarMap';
import Block from '@/components/Block';
import Dashboard from '@/components/Dashboard';
import PieSlice from '@/components/PieSlice';
import {project_name_to_region, project_name_to_firebase_name, project_name_to_max_mwh, project_name_to_lat_lon} from '@/components/projectData';



export default function DashboardPage() {

    //sign user into DB
    useEffect(() => {
      signInToSharedDB();
    }, []);



    /*

    STATE VARIABLES

    */

    //gets current user (the app keeps track of this for you)
    const { user, loading } = useAuth();
    //the variable that will store our realtime Firebase data when we use it in the code below
    const [realtimeData, setRealtimeData] = useState<any>(null);
    //the variable that will store our realtime Firebase data when we use it in the code below
    const [historicalData, setHistoricalData] = useState<any>(null);
    //the variable that will store our moer Firebase data when we use it in the code below
    const [moerData, setMoerData] = useState<any>(null);
    //the variable that will store our moer Firebase data when we use it in the code below
    const [healthData, setHealthData] = useState<any>(null);
    //the variable that will store our moer Firebase data when we use it in the code below
    const [csvData, setCsvData] = useState<any>(null);
    //stats object for displaying final images and stats on screen
    const [stats, setStats] = useState<any>(null);
    //weatherReady boolean (csv needs to load first)
    const [weatherReady, setWeatherReady] = useState<boolean>(false);
    //weather data
    const [weatherData, setWeatherData] = useState<any>(null);


    /*

    OTHER DATA STRUCTURES

    */


    

    //customer company (this will always be known by the time of 
    // login in the future, although it won't be hard-coded like 
    // this obviously)
    const customer_company = "Rivian"
    let relevant_projects: Array<string> = [];
    let relevant_regions: Array<string> = [];
    

    interface CSVRow {
        "Clearloop Partner": string;
        // add other fields as needed if you want
    }


    /*

    EFFECT HOOKS

    */

    //React hook to fetch data from csv file
    useEffect(() => {
        const fetchCSV = async () => {
            const response = await fetch('/data/CombinedProjectData.csv');
            const text = await response.text(); //csv as a string

            const parsed = Papa.parse<CSVRow>(text, { header: true }); //csv as an array of objects

            //filtered data for only customer company in csv
            const filtered_customer_company_data: Array<any> = [];

            //loop through each row in the csv file...
            for(let row in parsed.data) {

                //...and if the data is for the customer company we want to look at...
                if(parsed.data[row]["Clearloop Partner"] === customer_company) {

                    //...then save the row of data to look at later
                    filtered_customer_company_data.push(parsed.data[row]);

                    //get the current index for the operations below
                    const current_ind = filtered_customer_company_data.length - 1;

                    const project_name = filtered_customer_company_data[current_ind]["Project Name"];
                    const region = project_name_to_region[project_name];

                    filtered_customer_company_data[current_ind]["Region"] = region;

                    if(!relevant_projects.includes(project_name)){
                        relevant_projects.push(project_name);
                    }

                    if(!relevant_regions.includes(region)){
                        relevant_regions.push(region);
                    }

                }

            }

            setCsvData(filtered_customer_company_data);
            setWeatherReady(true);
        };

        fetchCSV();

    }, []);


    //React hook to fetch moer data from Firebase
    useEffect(() => {

        const fetchMoer = async () => {
            const dataRef = ref(database, 'moer'); // getting moer data
            
            //attempt to get snapshot of the data
            const snapshot = await get(dataRef);

            //if we got the snapshot...
            if (snapshot.exists()) {

                const original_moer_data = snapshot.val();

                //filtered Moer data
                const filtered_moer_data: Record<string, any> = {};

                //filter for only regions that customer company has sites in
                for(let region_num in relevant_regions) {

                    const region = relevant_regions[region_num]
 
                    if(original_moer_data[region]) {
                        filtered_moer_data[region] = original_moer_data[region]
                    }
                }

                setMoerData(filtered_moer_data);
            } else {
                setMoerData('No data found.');
            }
        };
        fetchMoer();
    }, []);

    //React hook to fetch moer data from Firebase
    useEffect(() => {

        const fetchHealth = async () => {
            const dataRef = ref(database, 'health'); // getting moer data
            
            //attempt to get snapshot of the data
            const snapshot = await get(dataRef);

            //if we got the snapshot...
            if (snapshot.exists()) {

                const original_health_data = snapshot.val();

                //filtered Moer data
                const filtered_health_data: Record<string, any> = {};

                //filter for only regions that customer company has sites in
                for(let region_num in relevant_regions) {

                    const region = relevant_regions[region_num]
 
                    if(original_health_data[region]) {
                        filtered_health_data[region] = original_health_data[region]
                    }
                }

                setHealthData(filtered_health_data);
            } else {
                setHealthData('No data found.');
            }
        };
        fetchHealth();
    }, []);

    //React hook to fetch realtime data from Firebase
    useEffect(() => {

        const fetchRealtime = async () => {
            const dataRef = ref(database, 'realtime'); // getting realtime data
            
            //attempt to get snapshot of the data
            const snapshot = await get(dataRef);

            //if we got the snapshot...
            if (snapshot.exists()) {

                const original_realtime_data = snapshot.val();
                
                //filter for only data from relevant projects
                const filtered_realtime_data: Record<string, any> = {};

                //Location
                const location_data = original_realtime_data["Location"];
                const filtered_location_data: Record<string, any> = {};
                for(let project_num in relevant_projects) {

                    const project = relevant_projects[project_num];
                    const renamed_project = project_name_to_firebase_name[project];
                    filtered_location_data[project] = location_data[renamed_project];
                }
                filtered_realtime_data["Location"] = filtered_location_data;

                //lastSixHours
                const lastSixHours_data = original_realtime_data["lastSixHours"]
                const filtered_lastSixHours_data: Record<string, any> = {};
                for(let project_num in relevant_projects) {

                    const project = relevant_projects[project_num];
                    const renamed_project = project_name_to_firebase_name[project];
                    filtered_lastSixHours_data[project] = lastSixHours_data[renamed_project];
    
                }
                filtered_realtime_data["lastSixHours"] = filtered_lastSixHours_data;

                //lastHour
                const lastHour_data = original_realtime_data["lastHour"];
                const filtered_lastHour_data: Record<string, any> = {};
                for(let project_num in relevant_projects) {

                    const project = relevant_projects[project_num];
                    const renamed_project = project_name_to_firebase_name[project];
                    filtered_lastHour_data[project] = lastHour_data[renamed_project];

    
                }
                filtered_realtime_data["lastHour"] = filtered_lastHour_data;

                //set data
                setRealtimeData(filtered_realtime_data);

            } else {
                setRealtimeData('No data found.');
            }
        };
        fetchRealtime();
    }, []);

    //React hook to fetch historical data from Firebase
    useEffect(() => {

        const fetchHistorical = async () => {
            const dataRef = ref(database, 'historical'); // getting realtime data
            
            //attempt to get snapshot of the data
            const snapshot = await get(dataRef);

            //if we got the snapshot...
            if (snapshot.exists()) {

                const original_historical_data = snapshot.val();
                
                //filter for only data from relevant projects
                const filtered_historical_data: Record<string, any> = {};

                //Location
                const filtered_location_data: Record<string, any> = {};
                for(let project_num in relevant_projects) {

                    const project = relevant_projects[project_num];
                    const renamed_project = project_name_to_firebase_name[project];
                    filtered_location_data[project] = original_historical_data[renamed_project];
                }
               

                //set data
                setHistoricalData(filtered_location_data);

            } else {
                setHistoricalData('No data found.');
            }
        };
        fetchHistorical();
    }, []);

    //React hook to fetch weather data
    useEffect(() => {
        if(!weatherReady) return;
        if (!user || loading) return;

        async function fetchWeather() {
          
            const to_ret: Record<string, any> = {};
            for(let project_num in csvData) {

                const project = csvData[project_num]["Project Name"]

                //get project lat and lon
                const lat = project_name_to_lat_lon[project].lat;
                const lon = project_name_to_lat_lon[project].lng;
                
                //current weather
                try {
                    const weather = await getWeatherAtCoords(lat, lon);
                    console.log('Current Weather for', project, weather);

                    //success
                    to_ret[project] = weather;
                    
                } catch (err) {
                    console.error('Error fetching current weather:', err);

                    //failure
                    to_ret[project] = "No data found.";
                }

                //forcasted weather
                try {
                    const weather = await getForecastAtCoords(lat, lon);
                    console.log('Forcasted Weather for', project, weather);

                    //success
                    to_ret[project + "-forcast"] = weather;
                    
                } catch (err) {
                    console.error('Error fetching forcasted weather:', err);

                    //failure
                    to_ret[project + "forcast"] = "No data found.";
                }

            }

            setWeatherData(to_ret);
            
        }

        fetchWeather();

    }, [weatherReady, user, loading]);

    //Makes React wait to call calculateStats until all three datasets are available
    useEffect(() => {

        

        if (csvData && moerData && realtimeData && historicalData && weatherData) {
            const ret = calculateStats(csvData, moerData, healthData, realtimeData, historicalData, weatherData);
            setStats(ret);
        }
    }, [csvData, moerData, healthData, realtimeData, historicalData, weatherData]);






    /*

    FUNCTIONS

    */

    
    
        


    //large function to calculcate all interesting statistics, given the above data
    function calculateStats(csvData: any, moerData: any, healthData: any, realtimeData: any, historicalData: any, weatherData: any) {

        //maps project name (str) to total percent of project (num)
        const percentage_of_project: Record<string, number> = {};

        //loop through customer company's projects
        for(let project_num in csvData) {

            //project
            const project = csvData[project_num]["Project Name"];

            //percent company has of that project
            const percent = Number(csvData[project_num]["Percent of project"].slice(0, -1));

            //add entry if necessary
            if(!(project in percentage_of_project)) {
                percentage_of_project[project] = 0;
            }

            //update with percent
            percentage_of_project[project] += (percent/100);

        }

        for(let key in percentage_of_project) {
            console.log("Project:", key, "total %:", percentage_of_project[key]*100, "%");
        }

        console.log("Company:", customer_company)

        const to_ret: Record<string, any> = {};

        to_ret["total"] = 
        {

            "Energy Production (MWh)": 0,
            "Carbon Avoided (lbs)": 0,
            "MAX (MWh)": 0,
            "Capacity (%)": 0,
            "name" : customer_company,
            "health": 0,
            "RECs": 0

        }

        to_ret["projects"] = []
        to_ret["coors"] = []

        for(let project in percentage_of_project) {

            //add coordinates
            to_ret["coors"].push(project_name_to_lat_lon[project]);

            const production = Number(realtimeData["lastHour"][project]["mwh"]);

            console.log(project, "produces", production, " (MWh)")

            const region = project_name_to_region[project];
            const marginal_operating_emissions_rate = moerData[region];
            const health_damage = healthData[region];

            const carbon_avoided = production * marginal_operating_emissions_rate;
            const customer_company_carbon_avoided = carbon_avoided * percentage_of_project[project];
            const customer_company_production = production * percentage_of_project[project];


            //sample, not true
            const max_company_production = project_name_to_max_mwh[project] * percentage_of_project[project];
            const capacity = (customer_company_production / max_company_production);

            to_ret[project] = 
            {

                "Energy Production (MWh)": customer_company_production,
                "Carbon Avoided (lbs)": customer_company_carbon_avoided,
                "MAX (MWh)": max_company_production,
                "Capacity (%)": capacity
                

            }

            to_ret["total"]["Energy Production (MWh)"] += customer_company_production;
            to_ret["total"]["Carbon Avoided (lbs)"] += customer_company_carbon_avoided;
            to_ret["total"]["MAX (MWh)"] += max_company_production;
            to_ret["total"]["Capacity (%)"] = to_ret["total"]["Energy Production (MWh)"] / to_ret["total"]["MAX (MWh)"];
            to_ret["total"]["moer"] = marginal_operating_emissions_rate;
            to_ret["total"]["health"] += (health_damage * customer_company_production);

            to_ret["projects"].push(project);

            console.log("TOTALS   proj: ", project, "production: ", production,"moer: ", marginal_operating_emissions_rate, "lbs carbon avoided", carbon_avoided);

            console.log(customer_company, "at", project,"avoided", customer_company_carbon_avoided, "lbs of carbon in the last hour because they generated", customer_company_production, "MWh of electricity\n\n")
        }


        //add other project-specific info from csv data
        for(let i=0; i<csvData.length; i++) {

            const project = csvData[i]["Project Name"];

            console.log("PROJECT", project)

            //get associated info
            const contract_start = csvData[i]["Executed Contract Date"];
            to_ret[project]["Contract Start"] = contract_start;
            const recs = csvData[i]["RECs"];
            //TODO: fix this calculation
            to_ret["total"]["RECs"] += (percentage_of_project[project] * Number(recs.replace(",", "")));

        }

        //historic data
        to_ret["historical"] = {};
        to_ret["historical"]["total"] = {};
        for(let project in historicalData) {

            to_ret["historical"][project] = {};
            
            //get company contract start date
            const contract_start = to_ret[project]["Contract Start"];

            //parse date
            const parsed_contract_start = contract_start.split('/');
            const month = parsed_contract_start[0];
            const year = parsed_contract_start[2];

            //adjust date strings
            const month_key = month.length == 1 ? "0" + month : month;
            const year_key = "20" + year;
            const month_key_num = Number(month_key);
            const year_key_num = Number(year_key);


            //search data
            //year
            let sum_mwh = 0;
            let sum_carbon = 0;
            for(let year_string in historicalData[project]) {

                const year_num = Number(year_string);

                //only continue if starting year is at most this year
                if(year_num >= year_key_num) {

                    //month
                    for(let month_string in historicalData[project][year_string]) {

                        const month_num = Number(month_string);

                        //only continue if starting year is less than this year
                        // OR starting year is this year, but starting month is less
                        if(year_num > year_key_num || (month_num >= month_key_num)) {

                            //data we want!
                            if(!to_ret["historical"][project][year_string]) {
                                to_ret["historical"][project][year_string] = {};
                            } 

                            let month_mwh = Number(historicalData[project][year_string][month_string].mwh) * percentage_of_project[project];
                            let month_co2 = Number(historicalData[project][year_string][month_string].co2) * percentage_of_project[project];

                            to_ret["historical"][project][year_string][month_string] = 
                            {
                                mwh: month_mwh,
                                co2: month_co2,
                            }

                            sum_mwh += month_mwh;
                            sum_carbon += month_co2;
                            
                        } 
                        
                    }
                }

            }

            to_ret["historical"]["total"][project] = {
                mwh: sum_mwh,
                co2: sum_carbon,
                health: sum_mwh*45
            };

        }
        

        //weather data
        const filteredWeatherData: Record<string, any> = {};

        for(let project_num in to_ret["projects"]) {

            const project = to_ret["projects"][project_num];
            

            if(weatherData["project"] != "No data found.") {
                //useful stats
                const temperature = (Number(weatherData[project]["main"]["temp"]) * 1.8) + 32;
                const clouds = Number(weatherData[project]["clouds"]["all"]);
                const description = weatherData[project]["weather"]["0"]["description"];
                const id = weatherData[project]["weather"]["0"]["id"];
                const humidity = Number(weatherData[project]["main"]["humidity"]);
                const visibility = Number(weatherData[project]["visibility"]);
                const sunrise = Number(weatherData[project]["sys"]["sunrise"]);
                const sunset = Number(weatherData[project]["sys"]["sunset"]);
                
                
                filteredWeatherData[project] = 
                {
                    temperature: temperature,
                    clouds: clouds,
                    visibility: visibility,
                    humidity: humidity,
                    description: description,
                    sunrise: sunrise,
                    sunset: sunset,
                    id: id
                }
            }
        }
        to_ret["weatherData"] = filteredWeatherData;



        //weather forcast data
        const filteredWeatherForcastData: Record<string, any> = {};
        for(let project_num in to_ret["projects"]) {

            const project = to_ret["projects"][project_num];
            const unfiltered_data = weatherData[project + "-forcast"].list;

            filteredWeatherForcastData[project] = [];

            //get next 8 entries (24 hours)
            //20 for filling space when needed
            for(let i=0; i<20; i++) {

                const temperature = (Number(weatherData[project + "-forcast"].list[i].main.temp) * 1.8) + 32;
                const id = weatherData[project + "-forcast"].list[i].weather[0].id;
                const dt = weatherData[project + "-forcast"].list[i].dt;

                filteredWeatherForcastData[project].push( { temperature: temperature, id: id, dt: dt } );

            }
            
        }
        to_ret["weatherForcastData"] = filteredWeatherForcastData;


        //stats for figures
        let capacity = Math.trunc(to_ret["total"]["Capacity (%)"] * 100 * 100) / 100;
        to_ret["dials"] = [];
        to_ret["dials"]["total_dial"] = [
        {
            label: "Overall",
            capacity: capacity, 
            color: capacityToColor(capacity/100)
        }]

        to_ret["dials"]["site_dials"] = [];
        let temp_dial_holder = []
        for(let project_num in to_ret["projects"]) {

            capacity = Math.trunc(to_ret[to_ret["projects"][project_num]]["Capacity (%)"] * 100 * 100) / 100;

            temp_dial_holder.push(
                {
                    label: to_ret["projects"][project_num],
                    capacity: capacity, 
                    color: capacityToColor(capacity/100)
                }
            )
        }
        to_ret["dials"]["site_dials"] = temp_dial_holder;

        return (to_ret)

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

    return (
        //see /components/ProtectedRoute.tsx to see how <ProtectedRoute> works
        <ProtectedRoute>
            <div className="mx-auto mt-8 text-center bg-black">

                <Dashboard stats={stats}></Dashboard>


                {/* sign out button */}
                <button
                    onClick={() => signOut(auth)}
                    className="mt-2 px-2 py-1 text-black font-bold rounded"
                    style={{ background: "#F7E15D" }}
                >
                    Log Out
                </button>

                <div className="mt-6 p-4 bg-green-100 rounded shadow text-left">
                    <h2 className="text-xl font-semibold text-black">Company:</h2>
                    <pre className="mt-2 text-lg whitespace-pre-wrap text-black">
                    {JSON.stringify(stats, null, 2)}
                    </pre>
                </div>
              
          </div>
      </ProtectedRoute>
  );
}
