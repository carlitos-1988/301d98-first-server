'use strict';
const axios = require("axios");

async function getPhotos(request,response, next){
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
}

class Photo {
    constructor(picObj) {
      this.src = picObj.urls.regular;
      this.alt = picObj.alt_description;
      this.userName = picObj.user.name;
    }
  }


module.exports = getPhotos;

//module.exports = {function1, function2, function3} for exporting multiple functions wrap it up in an object 