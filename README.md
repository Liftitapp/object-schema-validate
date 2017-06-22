# Object Schema Validator

[![Build Status](https://semaphoreci.com/api/v1/liftit/object-schema-validator/branches/master/shields_badge.svg)](https://semaphoreci.com/liftit/object-schema-validator)

A small library that validates objects according to schemas
It basically receives the `object` and a `schema` and return a new object with errors, otherwise an empty object, It can manage deep objects.

## Installation

  `npm install object-schema-validator`

## Usage

- ##### Simple Example
``` javascript
    // import
    var Validator = require('object-schema-validator');

    // Give some values
    var values = { email: 'not an email' };

    // Give set up the schema
    var schema = Validator({
      email: [
        {
          test(v) {
            return v.match(/.+?@.+\.\w{2,}/);
          },
          error: 'Valid email is required'
        },
        . . .
      ],
      . . .
    });

    // validate it
    schema.validate(values)
    console.log(schema.errors)
```
> Result: `{ email: [ 'Valid email is required' ] }`
> Now if `email` is valid the result is an empty object: `{}`

- ##### Advance example with a deep object and using a library ([is.js](http://is.js.org/))
``` javascript
var Validator = require('object-schema-validator');
var is = require('is_js');

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
    terms_of_service: [{
        valid: is.not.truthy,
        error: 'Acept terms of service please'
    }],
    user: {
        email: [{
                valid: (schema) => (schema.indexOf('@') != -1),
                error: 'A valid email s required'
            },
            {
                valid: is.not.number,
                error: 'Only letters'
            }
        ],
        name: [{
            test(schema) {
                return typeof schema === "string" && schema.length > 1;
            },
            error: "Name is required"
        }]
    },
    company: {
        email: [{
                valid: (schema) => (schema.indexOf('@') != -1),
                error: 'A valid email s required'
            },
            {
                valid: is.not.number,
                error: 'Only letters'
            }
        ],
        name: [{
            test(schema) {
                return typeof schema === "string" && schema.length > 1;
            },
            error: "Name is required"
        }]
    }
})
```

> Result:
```
{
    terms_of_service: ['Acept terms of service please'],
    user: {
        email: ['A valid email s required', 'Only letters'],
        name: ['Name is required']
    },
    company: {
        email: ['A valid email s required', 'Only letters'],
        name: ['Name is required']
    }
}
```

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
