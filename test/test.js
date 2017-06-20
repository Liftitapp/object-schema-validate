
var expect = require('chai').expect
var Validator = require('../lib/validator')
var is = require('is_js')

describe('Validator validate :)', function() {

  it('should return empty object if passes', function() {
    var values = { email: 'tes@tpepe.com' }
    var schema = Validator({
      email: [
        {
          test(v) {
            return v.match(/.+?@.+\.\w{2,}/);
          },
          error: "Valid email is required"
        }
      ]
    })
    schema.validate(values)
    var result = schema.errors
    expect(result).to.be.empty
  })

  it('should work with a library', function() {
    var values = { email: '' }
    var schema = Validator({
      email: [
        { valid: is.not.empty, error: 'It is required' }
      ]
    })
    schema.validate(values)
    var result = schema.errors
    expect(result).to.deep.include({ email: [ 'It is required' ] })
  })

  it('should return with multiple validations with one value', function() {
    var values = {
      user: {
        "email": "not an email"
      }
    }

    var schema = Validator({
      user: {
        email: [
          { valid: (schema) => (schema.indexOf('@') != -1), error: 'It should be a valid email' },
          { valid: is.not.empty, error: 'It is required' }
        ]
      }
    })
    schema.validate(values)
    var result = schema.errors
    expect(result.user.email).to.have.lengthOf(2)
  })

  it('should work with deep objects', function() {

    var expectedResult = {
      terms_of_service: [ 'Please accept terms of service' ],
      user:
       { email: [ 'Valid email required', 'It is required' ],
         name: [ 'Name is required' ] },
      company:
       { email: [ 'Valid email required', 'It is required' ],
         name: [ 'Name is required' ] }
   }

    var values = {
      terms_of_service: false,
      user: {
        "email": "hola",
        "name": 12342
      },
      company: {
        "email": "hola"
      }
    }

    var schema = Validator({
      terms_of_service: [{ valid: is.not.truthy, error: 'Please accept terms of service' }],
      user: {
        email: [
          { valid: (schema) => (schema.indexOf('@') != -1), error: 'Valid email required' },
          { valid: is.not.empty, error: 'It is required' }
        ],
        name: [{ test(schema) { return typeof schema === "string" && schema.length > 1; },
            error: "Name is required"
          }]
      },
      company: {
        email: [
          { valid: (schema) => (schema.indexOf('@') != -1), error: 'Valid email required' },
          { valid: is.not.empty, error: 'It is required' }
        ],
        name: [{ test(schema) { return typeof schema === "string" && schema.length > 1; },
            error: "Name is required"
          }]
      }
    })
    schema.validate(values)
    var result = schema.errors
    expect(result).to.deep.equal(expectedResult)
  })
})
