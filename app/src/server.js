'use strict';

const express = require('express');
const mongo = require('mongodb').MongoClient;
const importer = require('./importer');
const csv = require('express-csv');

var fs = require('fs');
var mongo_url = "mongodb://localhost:27017/pinakarri"

// Constants
const PORT = 8080;

// App
const app = express();

app.use('/pinakarri', express.static(__dirname + '/public'));

app.get('/pinakarri/units', function (req, res) {
  var data = [['id','raro','begleiter','raro gebucht','begleiter gebucht'],[3]];
  res.csv(data);
});

app.get('/pinakarri/subscriptions', function (req, res) {
 res.csv([ { name: "joe", id: 1 }]);
});

app.get('/pinakarri/api/unit/:uid', function (req, res) {

    mongo.connect(mongo_url, function(err, db) {
         var stream = db.collection('units').find().stream();
      stream.on("data", function(item) {res.json(item)});
      stream.on("end", function() {console.log('end')});


    });

});

app.get('/pinakarri/api/unit/:uid/subscriptions', function (req, res) {
  	var uid = req.params.uid

  	res.json(
  		[
  			{ enabled: true, identifier:'OA01', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
  			{ enabled: true, identifier:'OA02', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
  			{ enabled: true, identifier:'OA03', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
  			{ enabled: true, identifier:'OA04', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
  			{ enabled: true, identifier:'OA05', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } }
  		]);
});

app.post('/pinakarri/api/unit/:uid/subscription/:oa', function (req, res) {
    var uid = req.params.uid
    var oa = req.params.oa

    res.json(
      [
        { enabled: true, identifier:'OA01', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 19, booked : 3 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA02', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 19, booked : 3 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA03', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 19, booked : 3 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA04', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 19, booked : 3 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA05', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 19, booked : 3 }, leaders : { available: 4, booked : 0 } }
      ]);

});

app.delete('/pinakarri/api/unit/:uid/subscription/:oa', function (req, res) {
    var uid = req.params.uid
    var oa = req.params.oa

    res.json(
      [
        { enabled: true, identifier:'OA01', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA02', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA03', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA04', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } },
        { enabled: true, identifier:'OA05', name: 'Activity 1', external_link: 'http://www.google.at' , participants : { available: 20, booked : 2 }, leaders : { available: 4, booked : 0 } }
      ]);

});


fs.exists("source_data/data.xlsx", function(exists) {
    if (exists) {
        console.log("found data.xlsx, will import the data");
        importer.import_xls(mongo, mongo_url);
    }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);


