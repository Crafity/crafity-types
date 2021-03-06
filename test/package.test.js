/*jslint node: true, white: true, stupid: true */
"use strict";

/*!
 * package.test - package.json tests
 * Copyright(c) 2010-2013 Crafity
 * Copyright(c) 2010-2013 Bart Riemens
 * Copyright(c) 2010-2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */
  
var jstest = require('crafity-jstest')
  , assert = jstest.assert
  , context = jstest.createContext("Module Package")
  , fs = require('fs')
  , main
  ;

(function packageTests() {

  /**
   * The tests
   */
  var tests = {

    'The module must have main.js file': function () {

      main = require('../main');
      assert.isDefined(main, "Expected main to be defined");
    },

    'The module must have a fullname': function () {
      assert.isDefined(main.fullname, "Expected fullname to be defined");
    },

    'The module must have a version number': function () {
      assert.isDefined(main.version, "Expected version number to be defined");
    },

    'The module must have package.json file': function () {
      fs.readFileSync("./package.json");
    },

    'The module must have the same name as quoted in package.json': function () {

      var data = fs.readFileSync("./package.json")
        , json = JSON.parse(data.toString());

      assert.areEqual(json.name, main.fullname, "Expected module name to be the same in both places.");

    },

    'The module must have the same version as quoted in package.json': function () {

      var data = fs.readFileSync("./package.json")
        , json = JSON.parse(data.toString());

      assert.isDefined(json.version, "Expected fs to be defined");
      assert.areEqual(main.version, json.version, "Expected the same module version!");
    }

  };

  /**
   * Run the tests
   */
  context.run(tests);

}());
