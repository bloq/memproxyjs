
'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define('NotFound', { "error": {"code":404,"message":"not found"} });
define('InternalServer', { "error": {"code":500,"message":"internal server error"} });

