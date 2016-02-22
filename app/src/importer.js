const xls = require('node-xlsx');
var fs = require('fs');
var co = require('co');

module.exports = {
  import_xls: function (db) {
 

    var data = xls.parse("source_data/data.xlsx");
	  var units = [];
    var activities = [];

    var unit_docs = [];
    var activity_docs = [];

    data.forEach(function(sheet){
    	if (sheet.name == 'Activities')
    		activities = sheet.data;
    	else if (sheet.name == 'Units')
    		units = sheet.data;
    });

    units.forEach(function(row){
    	if (row[0].toLowerCase() != 'id') {
	    	unit_docs.push({ 	uid : guid(), 
    							identifier: row[0], name: row[1], 
    							participants: parseInt(row[2]), 
    							leaders: parseInt(row[3]) 
    					});
	    }
    })

	activities.forEach(function(row){
		//ignore the header row
    	if (row[0].toLowerCase() != 'id') {
    		activity_docs.push({ 
    			identifier : row[0], 
    			name: row[3], 
    			external_link: row[4],
    			participants: parseInt(row[1]),
    			leaders: parseInt(row[2])
	    	});	
	    }
    });

	co(function*() {
		console.log("Starting import");
	
		var col = db.collection('units');
		yield col.ensureIndex('identifier', {unique:true, background:true, w:1})
	
		for (var i = 0; i < unit_docs.length; i++) {
			yield col.insertOne(unit_docs[i], {w:0}); //w:0 -> don't fail on duplicates
	 	}


		col = db.collection('activities');
		yield col.ensureIndex('identifier', {unique:true, background:true, w:1})

    var tickets = db.collection('tickets'); 
    yield tickets.ensureIndex('id', {unique:true, background:true, w:1})

		for (var i = 0; i < activity_docs.length; i++) {
			yield col.insertOne(activity_docs[i], {w:0}); //w:0 -> don't fail on duplicates
      yield tickets.insertMany(createTickets(activity_docs[i].identifier, activity_docs[i].participants, 'P'), {w:0});
      yield tickets.insertMany(createTickets(activity_docs[i].identifier, activity_docs[i].leaders, 'L'), {w:0});
	 	}
	}).then(function () {
  		console.log("Import finished");
	}, function (err) {
  		console.error(err.stack);
	});


  }
  
};

function createTickets(activity_identifier, count, type){
  tickets = [];
  for (var i = 0; i < count; i++){
    tickets.push(
    {
      id : activity_identifier + "/" + (i+1) + "/" + type,
      type : type,
      activity : activity_identifier
    });
  }
  return tickets;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}