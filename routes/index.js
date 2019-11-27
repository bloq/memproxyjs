
'use strict';

const pjson = require('../package.json')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
      "name": pjson.name,
      "version": pjson.version,
  });
});

module.exports = router;
