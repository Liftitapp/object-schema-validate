const Validator = (function() {
  let errorMethod = 0;

  const setErrorMethod = function(errObj, errorKey, key, value){
    let path = errorKey.slice(0);
    path.forEach(function(location){
      if(!errObj[location]){
        errObj[location] = {};
      }
      errObj = errObj[location];
    });
    if(!errObj[key])
      errObj[key] = [];
    errObj[key].push(value);
  }

  const setError = function(errObj, errorKey, key, value) {
    if(errorMethod)
      setErrorMethod(...arguments)
    else
      setErrorMethod(...arguments)
  };

  const validate = function(object = {}, schema, errorObj,errorKey=[]) {
    let values = Object.keys(schema);

    for (let v = 0; v < values.length; v++) {
      let value = values[v];
      let objectValue = object[value] || null;
      let schemaItem = schema[value];

      if (schemaItem instanceof Array) {
        for (let i = 0; i < schemaItem.length; i++) {
          let item = schemaItem[i];
          try {
            if (!item.test(objectValue)) {
              setError(errorObj,errorKey, value, item.error || "ERROR");
            }
          } catch (e) {
            setError(errorObj,errorKey, value, item.error || "ERROR");
          }
        }
      } else if (schemaItem instanceof Object) {
        errorKey.push(value);
        validate(objectValue || {}, schemaItem, errorObj,errorKey);
        errorKey.pop();
      }
    }
  };

  const Validator = function() {
    if (!(this instanceof Validator)) {
      return new Validator(...arguments);
    }
    this.init(...arguments);
  };

  Validator.setErrorMode = function(m){
    errorMethod =  (!!m)|0;
  }

  Object.assign(Validator.prototype, {
    constructor: Validator,
    init(schema = {}) {
      this.schema = schema;
      this.errors = {};
    },
    validate(object = {}) {
      this.errors = {};
      validate(object, this.schema, this.errors);
      return !Object.keys(this.errors).length;
    }
  });

  return Validator;
})();

module.exports = Validator;
