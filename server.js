const express = require('express');
const fetch = require('node-fetch');
const config = require('./config.js');
const bodyParser = require('body-parser');

const server = express();

server.use(bodyParser.json());

const PORT = config.port;

const detailsArray = [];


server.get('/place', (req, res) => {
  const textSearch = req.query.textSearch;
  fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${textSearch}&key=${
      config.gmaps.apiKey
    }`
  )
    .then(res => res.json())
    .then(json => {
      let placeIdArr = json.results.map(element => element.place_id);
      placeIdArr.forEach(place => {
        fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place}&key=${
            config.gmaps.apiKey
          }`
        )
          .then(res => res.json())
          .then(json => detailsArray.push(json));
      });
    });
  res.send(detailsArray);
});

server.listen(PORT, err => {
  if (err) {
    console.log(`ERROR!, ${err}`);
  } else {
    console.log(`SUCCESS! Server listening on ${PORT}`);
  }
});
