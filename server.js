"use strinct";

const express = require("express");
require("dotenv").config();
const cors = require("cors");
let data = require("./data/petdata");
let weatherData = require("./data/weather");
const axios = require("axios");

// app is now the server - need to call Express to create the server
const app = express();

//allows anyone to hit our server
app.use(cors());

// Selects port for the application from env or selects 3002 if original is not available
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`We are up on ${PORT}`));

//  end points
//two args 1st arg-endpoint url
//2nd argument callback which will execute when that endpoint is hit
// the call back in the get function takes two parameters : request and response
//the send is required if not it will continue to run in circles
app.get("/", (request, response) => {
  response.status(200).send("Welcome to my server");
});

app.get("/hello", (request, response) => {
  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  console.log(request.query);

  response
    .status(200)
    .send(`Hello ${firstName} ${lastName}, welcome to my server`);
});
//Card One location
app.get("/weather", async (request, response, next) => {
  try {
    //console.log(weatherData[0].city_name);
    // let locaLat = request.query.lat;
    // let localLon = request.query.lon;
    let localCity = request.query.city;
    //let returnedCity = weatherData.find(city => city.city_name === localCity);

    let localUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${localCity}&country=US&key=${process.env.WEATHERBIT_API_KEY}`;

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
});

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

app.get("/movies", async (request, response, next) => {
  try {
    let cityMovieSearch = request.query.city;
    let myMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityMovieSearch}`;
    let returnedMovies = await axios.get(myMovieUrl);

    let dataToSend = returnedMovies.data.results.map(
      (obj) => new MovieforCity(obj)
    );

    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

class MovieforCity {
  constructor(movieObj) {
    this.id = movieObj.id;
    this.image = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
    this.title = movieObj.title;
    this.overview = movieObj.overview;
  }
}

app.get("/pet", (request, response, next) => {
  try {
    //give pet query
    let queriedSpecies = request.query.species;
    let foundPet = data.find((pet) => pet.species === queriedSpecies);

    let dataToSend = new Pet(foundPet);

    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

// class to goorm bulky data
class Pet {
  constructor(petObj) {
    this.name = petObj.name;
    this.breed = petObj.breed;
  }
}
//TODO: Photo end point

app.get("/photos", async (request, response, next) => {
  try {
    //generate variable for key value inside the query
    let myLocalCity = request.query.city;
    //url for the api to be queried
    let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${myLocalCity}`;

    let photosFromAxios = await axios.get(url);
    //the data will have to be mapped through every object in the class

    //loops through an array of objects and creates a Photo object based only on the needed info from the data
    let dataToSend = photosFromAxios.data.results.map((obj = new Photo(obj)));

    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

class Photo {
  constructor(picObj) {
    this.src = picObj.urls.regular;
    this.alt = picObj.alt_description;
    this.userName = picObj.user.name;
  }
}

//NOTE:this * will catch all of the bad links that do not exist, this function needs to be at the end of the file
app.get("*", (request, response) => {
  response.status(404).send("This page does not exist");
});

//This also lives at the bottom of the page handles errors read docs from express
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

//to start nodemon in the console
