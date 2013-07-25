/*jslint node: true, white: true */
"use strict";

/*!
 * crafity.types.test - Crafity Types tests
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
  , context = jstest.createContext()
  , Types = require('../lib/crafity.types').Types
  ;

(function packageTests() {

  /**
   * The tests
   */
  var tests = {

    'Register two of the same types with different version Then create an instance of the latest version': function () {

      var types = new Types();

      types.register({
        name: "Test",
        version: 2,
        type: {
          "name": "John Doe",
          "age": 33
        }
      });
      types.register({
        name: "Test",
        version: 1,
        type: {
          "name": "Jane Doe",
          "age": 34
        }
      });

      var instance = types.create("Test");

      assert.hasValue(instance, "Expected an instance");
      assert.areEqual("Test", instance.type, "Expected another type name");
      assert.areEqual(2, instance.version, "Expected another version");
      assert.areEqual("John Doe", instance.name, "Expected another name");
      assert.areEqual(33, instance.age, "Expected another age");
    },
    'Register two of the same types with two different version Then create an instance of a specific version': function () {
      var types = new Types();

      types.register({
        name: "Test",
        version: 2,
        type: {
          "name": "John Doe",
          "age": 33
        }
      });
      types.register({
        name: "Test",
        version: 1,
        type: {
          "name": "Jane Doe",
          "age": 34
        }
      });

      var instance = types.create("Test", 1);

      assert.hasValue(instance, "Expected an instance");
      assert.areEqual("Test", instance.type, "Expected another type name");
      assert.areEqual(1, instance.version, "Expected another version");
      assert.areEqual("Jane Doe", instance.name, "Expected another name");
      assert.areEqual(34, instance.age, "Expected another age");
    },
    'Register a type with validation logic Then validate an instance': function () {
      var types = new Types();

      types.register({
        name: "Test",
        version: 1,
        type: {
          "age": null
        },
        validate: function (instance) {
          if (!instance.age || instance.age < 18) {
            return [ "Must be at least 18 years old" ];
          }
          return [];
        }
      });

      (function negativeValidation() {
        var instance = types.create("Test")
          , results = types.get("Test").validate(instance);
        assert.hasValue(results, "Expected an instance");
        assert.areEqual(1, results.length, "Expected another amount of validation messages");
        assert.areEqual("Must be at least 18 years old", results[0], "Expected another validation message");
      }());
      (function positiveValidation() {
        var instance = types.create("Test", { age: 21 })
          , results = types.get("Test").validate(instance);
        assert.hasValue(results, "Expected an instance");
        assert.areEqual(0, results.length, "Expected another amount of validation messages");
      }());
    }

  };

  /**
   * Run the tests
   */
  context.run(tests);

}());
