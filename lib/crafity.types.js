/*jslint node: true, white: true */

function Types() {
  "use strict";
  var self = this
    , types = {};

  this.register = function (typeInfo) {

    if (!typeInfo) { throw new Error("Type information is required"); }

    var type = typeInfo.type;

    if (!typeInfo.name) {
      throw new Error("Type name is missing");
    }
    if (!typeInfo.version) {
      throw new Error("Type version is missing");
    }

    typeInfo.create = typeInfo.create || function create(values) {
      var instance = {
        "type": typeInfo.name,
        "version": typeInfo.version
      };

      if (type) {
        Object.keys(type).forEach(function (name) {
          instance[name] = type[name];
        });
      }
      if (values) {
        Object.keys(values).forEach(function (name) {
          instance[name] = values[name];
        });
      }

      return instance;
    };

    typeInfo.validate = (function (validation) {
      return function validate(instance) {
        var results = [];
        if (!instance) {
          results.push("Instance of type '" + typeInfo.name + "' can not be null or undefined");
        } else {
          if (!instance.type) {
            results.push("Instance of type '" + typeInfo.name + "' must have a type property");
          } else if (instance.type !== typeInfo.name) {
            results.push("Instance is of type '" + instance.type + "' and not of '" + typeInfo.name + "'");
          }
          if (!instance.version) {
            results.push("Instance of type '" + typeInfo.name + "' does not have a version");
          } else if (instance.version !== typeInfo.version) {
            results.push("Instance is version '" + instance.type + "' and not version '" + typeInfo.name + "'");
          }
          if (validation) {
            results = results.concat(validation(instance));
          }
        }
        return results;
      };
    }(typeInfo.validate));

    if (types[typeInfo.name] && types[typeInfo.name][typeInfo.version]) {
      throw new Error("Type '" + typeInfo.name + "' with version '" +
        typeInfo.version + "' is already registered.");
    }

    types[typeInfo.name] = types[typeInfo.name] || {};
    types[typeInfo.name][typeInfo.version] = typeInfo;

    if (typeInfo.version > (types[typeInfo.name].latestVersion || -1)) {
      types[typeInfo.name].latestVersion = typeInfo.version;
    }
  };

  this.validate = function (item) {
    return item && item.type && item.version &&
      types[item.type] && types[item.type][item.version]
      && types[item.type][item.version].validate(item);
  };

  this.get = function (name, version) {

    if (typeof name !== 'string' && typeof version !== 'number') {
      if (typeof name === 'object' && name.name && name.version) {
        version = name.version;
        name = name.name;
      } else if (typeof name === 'object' && name.type && name.version) {
        version = name.version;
        name = name.type;
      }
    }

    if (!types[name]) {
      throw new Error("Type '" + name + "' is not registered.");
    }
    version = version || types[name].latestVersion;
    if (!types[name][version]) {
      throw new Error("Type '" + name + "' with version '" +
        version + "' is not registered.");
    }
    return types[name][version];
  };

  this.getAll = function () {
    return Object.keys(types).map(function (name) {
      return types[name];
    });
  };

  this.create = function (name, version, values) {

    if (typeof name === 'string' && typeof version === 'object' && !values) {
      values = version;
      version = undefined;
    } else if (typeof name !== 'string' && typeof version !== 'number') {
      if (typeof name === 'object' && (name.type || name.name) && name.version) {
        values = name;
        version = name.version;
        name = name.type || name.name;
      }
    }

    return self.get(name, version).create(values);
  };
}

module.exports = new Types();
module.exports.Types = Types;
