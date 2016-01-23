var https = require("https");
var fs = require("fs");
var path = require("path");

var file = fs.createWriteStream(path.join(__dirname, "api.json"));
file.on("finish", function() {
  process.exit(0);
});
var request = https.get("https://nodejs.org/api/all.json", function(response) {
  response.pipe(file);
});
