var API = require("./api.json");
var APIMOD = API.modules;

var APITAGS = {};

var replaceSpecials = (function() {
  var regex = /[\(\)\[\]\{\}\,\ \.]+/gi;
  var regex2 = / /gi;

  return function(text) {
    return text.replace(regex, " ").toLowerCase().trim().replace(regex2, "_");
  };
})();

for(var i = 0; i < APIMOD.length; ++i) {
  var mod = APIMOD[i];
  var tags = APITAGS[mod.name] = {
    $base: mod.name + ".html"
  };
  var base = tags.$base + "#" + mod.name + "_";
  var methods = mod.methods;

  if(methods)
    for(var j = 0; j < methods.length; ++j) {
      var m = methods[j];
      tags[m.name] = base + replaceSpecials(m.textRaw);
    }
}

exports.onHandleTag = function(ev) {
  addTags(ev.data.tag, APITAGS);
};

function addTags(list, tags) {
  for(var key in tags) {
    var mods = tags[key];
    for(var key2 in mods) {
      var link = mods[key2];
      if(key2 !== "$base")
        addTag(list, key + "." + key2, key, link);
      else
        addTag(list, key, key, link);
    }
  }
}

function addTag(tagList, tagname, memberof, external) {
  tagList.push({
    __docId__: tagList.length,
    kind: "external",
    static: true,
    variation: null,
    name: tagname,
    externalLink: "https://nodejs.org/api/" + external,
    memberof: "BuiltinExternal/nodejs/" + memberof + ".js~" + memberof,
    longname: "BuiltinExternal/nodejs/" + memberof + ".js~" + tagname,
    access: null,
    description: null,
    builtinExternal: true
  });
}
