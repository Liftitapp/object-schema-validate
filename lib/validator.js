const Validator = (() => {
  const setErrorMethod = (errObj, errorKey, key, value) => {
    let path = errorKey.slice(0)
    path.forEach(location => {
      if(!errObj[location]){
        errObj[location] = {}
      }
      errObj = errObj[location]
    })
    if(!errObj[key])
      errObj[key] = []
    errObj[key].push(value)
  }

  const validate = (object = {}, schema, errorObj,errorKey=[]) => {
    let values = Object.keys(schema)

    for (let v in values) {
      let value = values[v]
      let objectValue = object[value] || null
      let schemaItem = schema[value]

      if (schemaItem instanceof Array) {
        for (let i in schemaItem) {
          let item = schemaItem[i]
          try {
            if (!item.test(objectValue)) {
              setErrorMethod(errorObj,errorKey, value, item.error || "ERROR")
            }
          } catch (e) {
            setErrorMethod(errorObj,errorKey, value, item.error || "ERROR")
          }
        }
      } else if (schemaItem instanceof Object) {
        errorKey.push(value)
        validate(objectValue || {}, schemaItem, errorObj,errorKey)
        errorKey.pop()
      }
    }
  }

  const Validator = function() {
    if (!(this instanceof Validator)) {
      return new Validator(...arguments)
    }
    this.init(...arguments)
  }

  Object.assign(Validator.prototype, {
    constructor: Validator,
    init(schema = {}) {
      this.schema = schema
      this.errors = {}
    },
    validate(object = {}) {
      this.errors = {}
      validate(object, this.schema, this.errors)
      return !Object.keys(this.errors).length
    }
  })

  return Validator
})()

module.exports = Validator
