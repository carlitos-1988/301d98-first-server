"use strinct";

const express = require("express");
require("dotenv").config();
const cors = require("cors");
let data = require("./data/petdata");
let weatherData = require("./data/weather");
const axios = require("axios");
const getPhotos = require('./modules/photos');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies')
const sayHello = require('./modules/hello')

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

app.get("/hello", sayHello);


//Card One location
app.get("/weather", getWeather);

app.get("/movies", getMovies)


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

//refactor slowly

app.get("/photos", getPhotos);


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
