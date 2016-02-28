'use strict';

const express = require('express');
const mongo = require('mongodb').MongoClient;
const importer = require('./importer');
const csv = require('express-csv');
const array = require('array');

var fs = require('fs');
var mongo_url = "mongodb://localhost:27017/pinakarri"

if (process.argv.length >= 3 && process.argv[2].startsWith('mongodb://'))
  mongo_url = process.argv[2];

// Constants
const PORT = 8080;

// App
const app = express();

var db;

var findUnit = function(req, res, callback){
  db.collection('units').findOne({uid:req.params.uid},function(err,unit){
      if (unit != null){
        callback(unit);
      }else{
        res.status(404).send('unit not found');
      }
  });
     
};

app.use('/pinakarri', express.static(__dirname + '/public'));

app.get('/pinakarri/tickets', function (req, res) {
  var data = [['date', 'activity', 'type', 'unit']];

  db.collection('tickets').find().toArray(function(err,all_tickets){
    all_tickets.forEach(function(ticket){
      if (ticket.booked_by){
        data.push([ticket.booked_at,ticket.activity,ticket.type,ticket.booked_by]);
      }
    });

    res.csv(data);
  });

});




app.get('/pinakarri/api/unit/:uid', function (req, res) {
    findUnit(req,res, function(unit){ 
        db.collection('tickets').find({booked_by:unit.identifier}).toArray(function(err,all_tickets){
          var tickets = array(all_tickets);  
          unit.tickets = {
              leaders : tickets.select("type == 'L'").sort('activity','ascending').map('activity'),
              participants : tickets.select("type == 'P'").sort('activity','ascending').map('activity')
          };

          res.json(unit);
        });
    });

});

var fetch_subscriptions = function(req, res, callback){
  findUnit(req,res, function(unit){
         db.collection('activities').find().toArray(function(err, activities){

            var subscriptions = array();

            db.collection('tickets').find().toArray(function(err,all_tickets){
              var tickets = array(all_tickets);  
              
              activities.forEach(function (activity){
                activity.participants = { 
                  available: tickets.select("type == 'P' && activity == '"+ activity.identifier + "' && booked_by == null").length, 
                  booked : tickets.select("type == 'P' && activity == '"+ activity.identifier + "' && booked_by == '" + unit.identifier + "'").length 
                };
                activity.leaders = { 
                  available: tickets.select("type == 'L' && activity == '"+ activity.identifier + "' && booked_by == null").length, 
                  booked : tickets.select("type == 'L' && activity == '"+ activity.identifier + "' && booked_by == '" + unit.identifier + "'").length 
                };

                subscriptions.push(activity);
              });

              callback(subscriptions);
            });
  
         });
      });
};

app.get('/pinakarri/api/unit/:uid/subscriptions', function (req, res) {
    fetch_subscriptions(req,res, function(subscriptions){
      res.json(subscriptions);
    });
});

app.post('/pinakarri/api/unit/:uid/subscription/:oa', function (req, res) {
    setTimeout(function(){    
        var uid = req.params.uid
        var oa = req.params.oa
        var type = req.query.type

        findUnit(req,res, function(unit){
          db.collection("locks").insertOne({createdAt: new Date(), key: unit.identifier}, {w:1}, function(err,lock){
            if (err!=null){
                console.log(err);
                console.log(unit.identifier + " was prevented from booking simultaniously");
                res.status(400).send('Please wait.. You cannot book seats simultaniously');   
            }else {

              //Verify that the unit has not yet booked too much of the activity
              db.collection("tickets").count({type:type, booked_by:unit.identifier}, function(err, tickets_already_booked) {

                  var overbooked = (type == 'P' && tickets_already_booked >= unit.participants) || (type == 'L' && tickets_already_booked >= unit.leaders);
                  if (overbooked) {
                     console.log(unit.identifier + " overbooking attempt for activity  " + oa + " was prevented (already booked all available seats)");
                     db.collection("locks").remove( { key: unit.identifier });
                     res.status(400).send('You are already finished, you have booked all your ' + tickets_already_booked + ' seats');   
                  }else{
                    db.collection("tickets").count({type:type, activity:oa, booked_by:unit.identifier}, function(err, booked_for_this_activity) {

                      var overbooked = (type == 'P' && booked_for_this_activity >= 3) || (type == 'L' && booked_for_this_activity >= 1);
                      if (overbooked){
                        console.log(unit.identifier + " overbooking attempt for activity  " + oa + " was prevented (exhausted the 3/1 seats contraint)");
                        db.collection("locks").remove( { key: unit.identifier });
                        res.status(400).send('You already have booked ' + booked_for_this_activity + ' seats');   
                      }else {

                          db.collection("tickets").findAndModify({activity: oa, type: type, booked_by : {$exists:false}}, [], {$set : {booked_by: unit.identifier, booked_at: new Date()}}, function(err,doc){
                            if (doc.value == null){
                              console.log(unit.identifier + " " + (type=='P'?"participant":"leader") + " attempted to book " + oa + " but no more tickets available.");
                              res.status(400).send('Sorry, no more tickets available');
                            } else{
                              console.log(unit.identifier + " " + (type=='P'?"participant":"leader") + " booked " + oa);
                              db.collection("locks").remove( { key: unit.identifier });
                              fetch_subscriptions(req,res, function(subscriptions){
                                res.json(subscriptions);
                              });
                            }
                          });
                       }
                    });
                  }
                });
            }
          });
        });

      },2000);

});

app.delete('/pinakarri/api/unit/:uid/subscription/:oa', function (req, res) {
    var uid = req.params.uid
    var oa = req.params.oa
    var type = req.query.type
    findUnit(req,res, function(unit){

      db.collection("tickets").findAndModify({activity: oa, type:type, booked_by : unit.identifier}, [], {$unset : {booked_by: "", booked_at:""}}, function(err,doc){
          if (doc.value == null){
            console.log(unit.identifier + " " + (type=='P'?"participant":"leader") + " attempted to unbook " + oa + " - but does not have a ticket!");
          }else{  
            console.log(unit.identifier + " " + (type=='P'?"participant":"leader") + " unbooked " + oa);
          }
         fetch_subscriptions(req,res, function(subscriptions){
          res.json(subscriptions);
        });
      });
    });

});


console.log("Initializing mongodb " + mongo_url);
// Initialize connection once
mongo.connect(mongo_url, function(err, database) {  
  if(err) throw err;
  
  db = database;

  fs.exists("source_data/data.xlsx", function(exists) {
      if (exists) {
        console.log("found data.xlsx, will import the data");
        importer.import_xls(database);
      }
  });

  db.collection('locks').ensureIndex('key', {unique:true, background:true, w:1})
  db.collection('locks').ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 1 } )

  app.listen(PORT);
  console.log('Running on http://localhost:' + PORT);

  db.collection('units').find().toArray(function(err,units){
      units.forEach(function(unit){
        console.log(unit.identifier + ": http://localhost:8080/pinakarri?uid=" + unit.uid);
      })
  });

});




