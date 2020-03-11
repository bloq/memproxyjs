'use strict'

function define(name, value) {
  Object.defineProperty(exports, name, {
    value,
    enumerable: true
  })
}

define('BadRequest', { error: { code: 400, message: 'invalid request' } })
define('NotFound', { error: { code: 404, message: 'not found' } })
define('InternalServer', {
  error: { code: 500, message: 'internal server error' }
})
