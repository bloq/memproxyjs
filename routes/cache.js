
'use strict';

const express = require('express');
const router = express.Router();
const jerr = require('../error');

/* GET cache item */
router.get('/:key', function(req, res, next) {
  var memcached = req.app.locals.memcached;
  memcached.get(req.params.key, function(err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer);
    } else if (!data) {
      res.status(404).json(jerr.NotFound);
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
	'Content-Length': data.length,
      });
      res.end(data);
    }
  });
});

module.exports = router;
