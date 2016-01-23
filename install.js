var https = require("https");
var fs = require("fs");
var path = require("path");

var request = https.get("https://nodejs.org/api/all.json", function(response) {
  var body = "";
  response.on("data", function(chunk) {
    body += chunk;
  });
  response.on("end", function() {
    var API = generateAPIExternals(JSON.parse(body));

    fs.writeFile(path.join(__dirname, "./externals.json"), JSON.stringify(API),
        function(err) {
      process.exit(err ? 1 : 0);
    });
  });
});

function generateAPIExternals(API) {
  var APIMOD = API.modules;
  var APITAGS = {};

  var replaceSpecials = (function() {
    var regex = /[\(\)\[\]\{\}\,\ \.\:]+/gi;
    var regex2 = / /gi;

    return function(text) {
      return text.replace(regex, " ").toLowerCase().trim().replace(regex2, "_");
    };
  })();

  for(var i = 0; i < APIMOD.length; ++i) {
    var mod = APIMOD[i];
    var baseName = mod.name.toLowerCase();
    var tags = APITAGS[baseName] = {
      $base: baseName + ".html"
    };
    var base = tags.$base + "#" + baseName + "_";

    if(mod.methods) {
      for(var j = 0; j < mod.methods.length; ++j) {
        var m = mod.methods[j];
        tags[m.name] = base + replaceSpecials(m.textRaw);
      }
    }

    if(mod.properties) {
      for(var j = 0; j < mod.properties.length; ++j) {
        var m = mod.properties[j];
        tags[m.name] = base + replaceSpecials(m.textRaw);
      }
    }

    if(mod.classes) {
      for(var k = 0; k < mod.classes.length; ++k) {
        var m = mod.classes[k];
        tags[m.name] = base + replaceSpecials(m.textRaw);

        if(m.methods) {
          for(var l = 0; l < m.methods.length; ++l) {
            var cm = m.methods[l];
            tags[m.name + "#" + cm.name] = base +
                replaceSpecials(m.textRaw);
          }
        }

        if(m.properties) {
          for(l = 0; l < m.properties.length; ++l) {
            var cm = m.properties[l];
            tags[m.name + "#" + cm.name] = base +
                replaceSpecials(m.textRaw);
          }
        }

        if(m.classMethods) {
          for(l = 0; l < m.classMethods.length; ++l) {
            var cm = m.classMethods[l];
            tags[m.name + "." + cm.name] = base +
                replaceSpecials(m.textRaw.replace("Class Method: "));
          }
        }
      }
    }
  }
  return APITAGS;
}
