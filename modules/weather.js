'use strict';
const axios = require("axios");

let cache = {};

async function getWeather(request, response,next){
    try {
        //console.log(weatherData[0].city_name);
        let localLat = request.query.lat;
        let localLon = request.query.lon;

        let key = `${localLat}-${localLon}-weather`;

        if(cache[key] && (Date.now() - cache[key].timeStamp) < 8.64e+7){

            //console.log('weather cashe was hit', cache);
            response.status(200).send(cache[key].data)


        }else{
            //console.log('cache was missed');

            //let localCity = request.query.city;
            //let returnedCity = weatherData.find(city => city.city_name === localCity);
        
            let localUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${localLat}&lon=${localLon}&key=${process.env.WEATHERBIT_API_KEY}`;
        
            let returnedWeather = await axios.get(localUrl);
        
            let dataToSend = new Weather(returnedWeather.data);
            dataToSend.generateWeatherData();
            dataToSend.generateForCity();
            //console.log(dataToSend.myWeatherData);

            //console.log('made it to the last part of else ', dataToSend.cityWeatherData);

            cache[key] = {
                data: dataToSend.cityWeatherData,
                timeStamp: Date.now()
            }
            response.status(200).send(dataToSend.cityWeatherData);

        }

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