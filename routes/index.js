
'use strict';

const pjson = require('../package.json')

var express = require('express');
var router = express.Router();

// GET server identity
router.get('/', function(req, res, next) {
  res.json({
      "name": pjson.name,
      "version": pjson.version,
  });
});

// memcache stats; also serves as a health check
router.get('/stats', function(req, res) {
  var memcached = req.app.locals.memcached;
  memcached.stats(function(err, results) {
    if (err) {
      res.status(500).json(jerr.InternalServer);
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
