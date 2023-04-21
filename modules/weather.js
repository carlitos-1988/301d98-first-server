'use strict';
const axios = require("axios");

async function getWeather(request, response,next){
    try {
        //console.log(weatherData[0].city_name);
        let locaLat = request.query.lat;
        let localLon = request.query.lon;
        //let localCity = request.query.city;
        //let returnedCity = weatherData.find(city => city.city_name === localCity);
    
        let localUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${locaLat}&lon=${localLon}&key=${process.env.WEATHERBIT_API_KEY}`;
    
        let returnedWeather = await axios.get(localUrl);
    
        let dataToSend = new Weather(returnedWeather.data);
        dataToSend.generateWeatherData();
        dataToSend.generateForCity();
        //console.log(dataToSend.myWeatherData);
    
        // let returnedWeather = weatherData.find(weather => weather.data.description === )
    
        response.status(200).send(dataToSend.cityWeatherData);
      } catch (error) {
        next(error);
      }
};

class Weather {
    constructor(weatherObj) {
      (this.cityName = weatherObj.city_name),
        (this.lattitude = weatherObj.lon),
        (this.longitude = weatherObj.lat);
      this.data = weatherObj.data;
    }
    myWeatherData = [];
  
    cityWeatherData = [];
  
    generateForCity() {
      this.cityWeatherData = this.myWeatherData.reduce(
        (allweather, dayweather) => {
          allweather.push({
            description: `Low of ${dayweather.lowtemp}, high of ${dayweather.hightemp} with ${dayweather.description}`,
            date: dayweather.date,
          });
          return allweather;
        },
        []
      );
    }

    generateWeatherData() {
        this.myWeatherData = this.data.reduce((allweather, dayweather) => {
          // console.log(dayweather.datetime);
          // console.log(dayweather.high_temp);
          // console.log(dayweather.low_temp);
          allweather.push({
            date: dayweather.datetime,
            hightemp: dayweather.max_temp,
            lowtemp: dayweather.min_temp,
            description: dayweather.weather.description,
          });
          return allweather;
        }, []);
      }
    }



module.exports = getWeather;