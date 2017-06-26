"use strict";

var Validator = function () {
  var setErrorMethod = function setErrorMethod(errObj, errorKey, key, value) {
    var path = errorKey.slice(0);
    path.forEach(function (location) {
      if (!errObj[location]) {
        errObj[location] = {};
      }
      errObj = errObj[location];
    });
    if (!errObj[key]) errObj[key] = [];
    errObj[key].push(value);
  };

  var _validate = function _validate() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var schema = arguments[1];
    var errorObj = arguments[2];
    var errorKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var values = Object.keys(schema);

    for (var v in values) {
      var value = values[v];
      var objectValue = object[value] || null;
      var schemaItem = schema[value];

      if (schemaItem instanceof Array) {
        for (var i in schemaItem) {
          var item = schemaItem[i];
          try {
            if (!item.test(objectValue)) {
              setErrorMethod(errorObj, errorKey, value, item.error || "ERROR");
            }
          } catch (e) {
            setErrorMethod(errorObj, errorKey, value, item.error || "ERROR");
          }
        }
      } else if (schemaItem instanceof Object) {
        errorKey.push(value);
        _validate(objectValue || {}, schemaItem, errorObj, errorKey);
        errorKey.pop();
      }
    }
  };

  var Validator = function Validator() {
    if (!(this instanceof Validator)) {
      return new (Function.prototype.bind.apply(Validator, [null].concat(Array.prototype.slice.call(arguments))))();
    }
    this.init.apply(this, arguments);
  };

  Object.assign(Validator.prototype, {
    constructor: Validator,
    init: function init() {
      var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.schema = schema;
      this.errors = {};
    },
    validate: function validate() {
      var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.errors = {};
      _validate(object, this.schema, this.errors);
      return !Object.keys(this.errors).length;
    }
  });

  return Validator;
}();

module.exports = Validator;