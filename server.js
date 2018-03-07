const express = require('express');
const fetch = require('node-fetch');
const config = require('./config.js');

const server = express();
const PORT = config.port;

const detailsArray = [];

server.get('/place', (req, res) => {
  const textSearch = req.query.textSearch;
  let placeEndPoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${textSearch}&key=${config.gmaps.apiKey}`
  fetch(placeEndPoint)
    .then(res => res.json())
    .then(json => {
      let placeIdArr = json.results.map(element => element.place_id);
      placeIdArr.forEach(place => {
        let detailEndPoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place}&key=${config.gmaps.apiKey}`
        fetch(detailEndPoint)
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
