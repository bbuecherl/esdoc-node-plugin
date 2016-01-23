var API = require("./externals.json");

exports.onHandleTag = function(ev) {
  addTags(ev.data.tag, API);
};

function addTags(list, tags) {
  for(var key in tags) {
    var mods = tags[key];
    for(var key2 in mods) {
      var link = mods[key2];
      if(key2 !== "$base")
        addTag(list, key2, key, link);
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
