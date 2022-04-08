const axios = require('axios')
const config = require("../config/config")

async function getPlacesDistance(fromLat, fromLong, toLat, toLong){
    let link = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${fromLat},${fromLong}&destinations=${toLat},${toLong}&key=${config.googleKey}`;
    console.log(JSON.stringify(link))
    let data = await axios.get(link);
    data = data.data;
    console.log(JSON.stringify(data));

    return {
        distance: data.rows[0].elements[0].distance || { text: "0 km", value: 0 },
        duration: data.rows[0].elements[0].duration || { text: "0 min", value: 0 }, 
    };
    // return data;
}

module.exports = {
    getPlacesDistance
}