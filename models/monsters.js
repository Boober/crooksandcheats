
var mongoClient = require('mongodb').MongoClient;

var connection_string = 'mongodb://localhost:27017/crooksdb';

/*
* If there is an MLAB password, we should use it instead of the local one.
*/

console.log("Testing connection...");
if (process.env.MLAB_CROOKSDB_PASSWD)
{
	console.log("successful adding external connection...");
	connection_string = "mongodb://admin:"
						+ process.env.MLAB_CROOKSDB_PASSWD
						+ "@ds155820.mlab.com:55820/crooksdb";
}


//Global var for connected database

var mongoDB;

console.log(connection_string);

mongoClient.connect(connection_string, function(err,db) {
	if (err) doError(err);
	console.log("Connected to MongoDB server.");
	mongoDB = db;
});


/****************** CRUD Create -> Mongo Insert ********************/

exports.create = function(data,callback)
{
	mongoDB.collection("monsters").insertOne(
		data,
		function(err,status)
		{
			if (err) doError(err);
			var success = (status.result.n == 1 ? true : false);
			callback(success);
			console.log("Insert into Monsters successful.");
		});
}


/*************** CRUD Retrieve -> Mongo Find ***********************/

exports.retrieve = function(query,callback)
{
	mongoDB.collection("monsters").find(query).toArray(function(err,docs)
	{
		if (err) doError(err);
		console.log("No errors, performing callback.");
		callback(docs);
	})
}


/*************** CRUD Update -> Mongo updateMany *********************/

exports.update = function(filter,update,callback)
{
	mongoDB.collection("monsters").updateMany(
		filter,
		update,
		{upsert:true},

		function(err,status) {
			if (err) doError(err);
			callback('Modified ' + status.modifiedCount + ' and added ' + status.upsertedCount + " documents");
		});
}


/************** CRUD Delete -> Mongo deleteMany *********************/

exports.delete = function(query, callback)
{
	mongoDB.collection("monsters").deleteMany(
		query,
		function(err,status)
		{
			if (err) throw err;
			callback(status.result.n + "document(s) have been removed.");
		});
}




var doError = function(e)
{
	console.error("Error: " + e);
	throw new Error(e);
}