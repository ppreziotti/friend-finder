var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up express app in order to create server
var app = express();
// Prepares server to be run through deployment or locally
var PORT = process.env.PORT || 3000;

// Using express to serve static HTML/CSS files and images
app.use(express.static(path.join(__dirname, "app/public")));

// Sets up data parsing for express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Starting the server
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});

// Pointing server toward router files
require("./app/routing/apiRoutes.js")(app);
require("./app/routing/htmlRoutes.js")(app);
