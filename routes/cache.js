
'use strict';

const express = require('express');
const router = express.Router();
const jerr = require('../error');
const bodyParser = require('body-parser');
const validator = require('validator');

router.use(bodyParser.raw({type: '*/*'}));

function decode_key(req)
{
  const raw_hdr = req.header('X-MC-Key');
  if (!raw_hdr || !validator.isBase64(raw_hdr))
    return null;
  const buf = Buffer.from(raw_hdr, 'base64');
  return buf;
}

// GET cache item
router.get('/item', function(req, res) {
  // decode key from http header
  const key = decode_key(req);
  if (!key) {
      return res.status(400).json(jerr.BadRequest);
  }

  // call memcached with key
  var memcached = req.app.locals.memcached;
  memcached.get(key, function(err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer);
    } else if (!data || !data.length) {
      res.status(404).json(jerr.NotFound);
    } else {
      //console.log("RETURNING DATA:");
      //console.log(data);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
	'Content-Length': data.length,
      });
      res.end(data);
    }
  });
});

// PUT cache item
router.put('/item', function(req, res) {
  // decode key from http header
  const key = decode_key(req);
  if (!key) {
      res.status(400).json(jerr.BadRequest);
  }

  var memcached = req.app.locals.memcached;
  memcached.set(key, req.body, 0, function(err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer);
    } else {
      res.json({"result":true});
    }
  });
});

module.exports = router;
