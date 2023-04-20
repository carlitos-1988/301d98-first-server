'use strict';

const axios = require('axios');

async function sayHello(request, response, next){

    try{
        
    let firstName = request.query.firstName;
    let lastName = request.query.lastName;
  
    console.log(request.query);
  
    response
      .status(200)
      .send(`Hello ${firstName} ${lastName}, welcome to my server`);
    }catch(error){
        next(error);
    }


}

module.exports = sayHello;