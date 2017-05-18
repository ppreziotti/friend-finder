var friends = require("../data/friends.js");

module.exports = function(app) {
	// Route that displays the friends array in JSON format
	app.get("/api/friends", function(req, res) {
		res.json(friends);
	});
	// Route that pushes a new friend object to the friends array
	app.post("/api/friends", function(req, res) {
		var newFriend = req.body;
		friends.push(newFriend);
		res.json(friends);
	});
}