
'use strict';

const express = require('express');
const router = express.Router();
const jerr = require('../error');
const bodyParser = require('body-parser');

router.use(bodyParser.raw({type: '*/*'}));

// GET cache item
router.get('/:key', function(req, res) {
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

// PUT cache item
router.put('/:key', function(req, res) {
  var memcached = req.app.locals.memcached;
  console.log(req);
  memcached.set(req.params.key, req.body, 0, function(err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer);
    } else {
      res.json({"result":true});
    }
  });
});

module.exports = router;
