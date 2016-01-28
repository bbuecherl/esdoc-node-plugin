var API = require("./externals.json");

exports.onHandleTag = function(ev) {
  for(var key in API) {
    var mods = API[key];
    for(var key2 in mods) {
      var link = mods[key2];
      if(key2 !== "$base")
        addTag(ev.data.tag, key2, key, link);
      else
        addTag(ev.data.tag, key, key, link);
    }
  }
};

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
