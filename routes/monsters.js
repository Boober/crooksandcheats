

//include the model
var model = require("../models/monsters.js");

//Define the collection name.
let cname = "monsters";

exports.init = function(app)
{
	app.put("/" + cname, doCreate);
	app.get("/" + cname, doRetrieve);
	app.get("/all/" + cname, RetrieveAll);
	app.post("/" + cname, doUpdate);
	app.delete("/" + cname, doDelete);
}


RetrieveAll = function(req,res)
{
	model.retrieveAll(null,
								function(modelData) {
									if (modelData.length)
									{
										console.log("Rendering results.");
										res.json(modelData);

									} else {
										console.log("No documents.");
							//			var message = "No documents with" + JSON.stringify(req.query)+
					//									" in collection " + cname + " found.";
				//						res.render('message', {title: 'monsters', obj: message});			
										res.json({});
									}
								});
}


doCreate = function(req,res)
{
	if (Object.keys(req.body).length == 0)
	{
		res.render('message', {title: 'monsters', obj: "No create message body found"});
		return;
	}

	//Restrict the parameters to the ones we expect. 9Don't allow user to add properties outside of what we expect.
	else if (Object.keys(req.body).length != 4 &&
		(!req.body.name || !req.body.health || !req.body.description || !req.body.attack))
	{
		res.render('message', {title: 'monsters', obj: "Invalid parameters. (Need name, health, description, and attack.)"});
		return;
	}


	model.create(req.body,
							function(result) {
								var success = (result ? "Create successful" : "Create unsuccessful");
								res.render('message', {title: 'monsters', obj: success});
							});
}


doRetrieve = function(req,res)
{
	model.retrieve(req.query,
								function(modelData) {
									if (modelData.length)
									{
										console.log("Rendering results.");
										res.render('results',{title: 'monsters', obj: modelData});

									} else {
										console.log("No documents.");
										var message = "No documents with" + JSON.stringify(req.query)+
														" in collection " + cname + " found.";
										res.render('message', {title: 'monsters', obj: message});			
									}
								});
}


doUpdate = function(req,res)
{
	var filter = req.body.find ? JSON.parse(req.body.find) : {};

	if (!req.body.update)
	{
		res.render('message', {title: 'monsters', obj: "No update operation defined."});
	}

	var update = JSON.parse(req.body.update);

	model.update(filter, update,
					function(status) {
						res.render('message',{title: 'monsters', obj: status});
					});
}


doDelete = function(req,res)
{
	var query = req.body.delete ? JSON.parse(req.body.delete) : {};

	model.delete(query,
				 	function(status) {
				 		res.render('message', {title: 'monsters', obj: status});
				 	});
}