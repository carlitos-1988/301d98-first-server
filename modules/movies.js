'use strict';
const axios = require("axios");

async function getMovies(request,response,next){
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

}

class MovieforCity {
    constructor(movieObj) {
      this.id = movieObj.id;
      this.image = `https://image.tmdb.org/t/p/w400${movieObj.poster_path}`;
      this.title = movieObj.title;
      this.overview = movieObj.overview;
    }
  }


module.exports = getMovies;