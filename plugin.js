var path = require("path");
var API = require("./externals.json");
var PACKAGES = {};
var MODULES;
var _used = [];

exports.onStart = function(ev) {
  ev.data.option = ev.data.option || {};
  var pkg = ev.data.option.base;
  if(pkg) {
    var base = path.resolve(process.cwd(), pkg);
    var json = require(path.join(base, "package.json"));
    if(json.dependencies) {
      for(var dep in json.dependencies) {
        var pkg = require(path.join(base, "node_modules", dep, "package.json"));
        PACKAGES[dep] = pkg.homepage || (pkg.repository && pkg.repository.url);
      }
    }
    if(ev.data.option.devDependencies && json.devDependencies) {
      for(var dep in json.devDependencies) {
        var pkg = require(path.join(base, "node_modules", dep, "package.json"));
        PACKAGES[dep] = pkg.homepage || (pkg.repository && pkg.repository.url);
      }
    }
  }
  MODULES = Object.keys(PACKAGES);
};

exports.onHandleTag = function(ev) {
  var initialLength = ev.data.tag.length;
  for(var i = 0, tag; i < initialLength; ++i) {
    tag = ev.data.tag[i];

    parseTagForDependencies(ev.data.tag, tag, "extends", true);
    parseTagForDependencies(ev.data.tag, tag, "type.types", true);
    parseTagForDependencies(ev.data.tag, tag, "return.types", true);

    if(tag.params && tag.params.length > 0) {
      for(var j = 0; j < tag.params.length; ++j) {
        parseTagForDependencies(ev.data.tag, tag.params[j], "types", true);
      }
    }
    if(tag.properties && tag.properties.length > 0) {
      for(var j = 0; j < tag.properties.length; ++j) {
        parseTagForDependencies(ev.data.tag, tag.properties[j], "types", true);
      }
    }
  }

  for(var key in API) {
    var mods = API[key];
    for(var key2 in mods) {
      var link = mods[key2];
      if(key2 !== "$base")
        addNodeTag(ev.data.tag, key2, key, link);
      else
        addNodeTag(ev.data.tag, key, key, link);
    }
  }
};

function parseTagForDependency(tags, ex) {
  if(_used.indexOf(ex) !== -1)
    return;
  if(ex.indexOf("~") !== -1) {
    var k = MODULES.indexOf(ex.split("~")[0])
    if(k !== -1) {
      addDependencyTag(tags, MODULES[k], PACKAGES[MODULES[k]], ex);
      _used.push(ex);
    }
  } else {
    var k = MODULES.indexOf(ex)
    if(k !== -1) {
      addDependencyTag(tags, MODULES[k], PACKAGES[MODULES[k]], ex);
      _used.push(ex);
    }
  }
}

function parseTagForDependencies(tags, tag, prop, isList) {
  var path = prop.split(".");
  var el = tag;
  for(var i = 0; i < path.length; ++i) {
    if(path[i] in el)
      el = el[path[i]];
    else return;
  }

  if(isList) {
    for(var j = 0; j < el.length; ++j) {
      parseTagForDependency(tags, el[j]);
    }
  } else {
    parseTagForDependency(tags, el);
  }
}

function addDependencyTag(tagList, tagname, url, longname) {
  tagList.push({
    __docId__: tagList.length,
    kind: "external",
    static: true,
    variation: null,
    name: longname,
    externalLink: url,
    memberof: "BuiltinExternal/node_modules/" + tagname + ".js",
    longname: "BuiltinExternal/node_modules/" + tagname + ".js" +
        longname.replace(tagname, ""),
    access: null,
    description: null,
    builtinExternal: true
  });
}

function addNodeTag(tagList, tagname, memberof, external) {
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
