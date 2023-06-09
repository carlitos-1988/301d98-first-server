'use strict';
const axios = require("axios");

let cache ={};

async function getPhotos(request,response, next){
    try {
        let myLocalCity = request.query.city;
        let key = `${myLocalCity}-photos`;
        
        if(cache[key] && (Date.now() - cache[key].timeStamp) < 8.64e+7){
            console.log('cache was hit!', cache);
            response.status(200).send(cache[key].data)
        
        
        }else{
            console.log('cache was missed');

            //generate variable for key value inside the query
            //url for the api to be queried
            let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${myLocalCity}`;
            
            //the data will have to be mapped through every object in the class 
            //loops through an array of objects and creates a Photo object based only on the needed info from the data
            let photosFromAxios = await axios.get(url);
            let dataToSend = photosFromAxios.data.results.map((obj = new Photo(obj)));

            cache[key] = {
                data: dataToSend,
                timeStamp: Date.now()
            }

            response.status(200).send(dataToSend);

        }
    
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