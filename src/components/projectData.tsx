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
    "White Pine": 2.8
};

//mapping project to its lat and lon
export const project_name_to_lat_lon: Record<string, any> = {

    "Jackson II": { lat: 35.607757, lng: -88.917046, label: "Jackson II"},
    "Panola I": { lat: 34.3041527, lng: -89.98631801, label: "Panola I"},
    "Panola II": { lat: 34.34085632, lng: -89.91117261, label: "Panola II"},
    "Panola III": { lat: 34.302365, lng: -89.987844, label: "Panola II"},
    "Paris BPU": { lat: 36.4463, lng: -88.327083, label: "Paris BPU"},
    "White Pine": { lat: 36.123581, lng: -83.284975, label: "White Pine"}

};