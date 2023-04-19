'use strinct';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let data = require('./data/petdata');
let weatherData = require('./data/weather');






// app is now the server - need to call Express to create the server
const app = express();

//allows anyone to hit our server
app.use(cors());

// Selects port for the application from env or selects 3002 if original is not available 
const PORT = process.env.PORT ||  3002;


app.listen(PORT, ()=> console.log(`We are up on ${PORT}`));

//  end points 
//two args 1st arg-endpoint url
//2nd argument callback which will execute when that endpoint is hit 
// the call back in the get function takes two parameters : request and response 
//the send is required if not it will continue to run in circles 
app.get('/', (request,response)=>{
    response.status(200).send('Welcome to my server');
});

app.get('/hello', (request, response)=>{
    let firstName = request.query.firstName;
    let lastName = request.query.lastName;

    console.log(request.query);

    response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server`)
})
//Card One location
app.get('/weather', (request,response,next)=>{
     try{
    console.log(weatherData[0].city_name);
    let locaLat = request.query.lat;
    let localLon = request.query.lon;
    let localCity = request.query.city;
    let returnedCity = weatherData.find(city => city.city_name === localCity);
    //console.log(returnedCity);
    
    let dataToSend = new Weather(returnedCity);
    dataToSend.generateWeatherData();
    console.log(dataToSend.myWeatherData);

    // let returnedWeather = weatherData.find(weather => weather.data.description === )

    response.status(200).send(dataToSend.myWeatherData);
     }catch(error){
        next(error);
     }
    

})

class Weather{
    constructor(weatherObj){
        this.cityName = weatherObj.city_name,
        this.lattitude = weatherObj.lon,
        this.longitude = weatherObj.lat,
        this.data = weatherObj.data
    }
    myWeatherData =[];

    generateWeatherData(){
        this.myWeatherData = this.data.reduce((allweather,dayweather)=>{
            // console.log(dayweather.datetime);
            // console.log(dayweather.high_temp);
            // console.log(dayweather.low_temp);
            allweather.push({'date':dayweather.datetime},{'hightemp': dayweather.high_temp}, {'lowtemp': dayweather.low_temp});
            return allweather;
        },[]);
    }
}

class Forecast{
    constructor(weatherObj){
        this.date = weatherObj.datetime,
        this.description = weatherObj.description
    }
}



app.get('/pet', (request, response, next)=>{
    try{
        //give pet query
        let queriedSpecies = request.query.species;
        let foundPet = data.find(pet => pet.species === queriedSpecies)

        let dataToSend = new Pet(foundPet);

        response.status(200).send(dataToSend);
    }catch(error){
        next(error)
    }
})

// class to goorm bulky data 
class Pet {
    constructor(petObj){
        this.name = petObj.name;
        this.breed = petObj.breed
    }
}
//TODO: Look at lab start to get started with query 











//NOTE:this * will catch all of the bad links that do not exist, this function needs to be at the end of the file
app.get('*', (request,response)=>{
    response.status(404).send("This page does not exist");
})

//This also lives at the bottom of the page handles errors read docs from express
app.use((error, request,response, next)=>{
    console.log(error.message);
    response.status(500).send(error.message);
})




//to start nodemon in the console 

