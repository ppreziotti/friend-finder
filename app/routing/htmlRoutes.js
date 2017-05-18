var path = require("path");

module.exports = function(app) {
	// Route that takes user to the survey page
	app.get("/survey", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/", "survey.html"));
	});
	// Route that takes user to the home page by default if no route is found
	app.use(function(req, res) {
		res.sendFile(path.join(__dirname, "../public/", "home.html"));
	});
}