'use strict'

const express = require('express')
const router = express.Router()
const jerr = require('../error')
const bodyParser = require('body-parser')
const validator = require('validator')

router.use(bodyParser.raw({ type: '*/*' }))

function decodeKey(req) {
  const rawHeader = req.header('X-MC-Key')
  if (!rawHeader || !validator.isBase64(rawHeader)) return null
  const buf = Buffer.from(rawHeader, 'base64')
  return buf
}

function decodeExpiration(req) {
  const rawHeader = req.header('X-MC-Exp')
  if (!rawHeader || !validator.isInt(rawHeader)) return null
  const exp = parseInt(rawHeader)
  if (exp < 0) return null
  return exp
}

// GET cache item
router.get('/item', function(req, res) {
  // decode key from http header
  const key = decodeKey(req)
  if (!key) {
    return res.status(400).json(jerr.BadRequest)
  }

  // call memcached with key
  const memcached = req.app.locals.memcached
  memcached.get(key, function(err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer)
    } else if (!data || !data.length) {
      res.status(404).json(jerr.NotFound)
    } else {
      // console.log("RETURNING DATA:");
      // console.log(data);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': data.length
      })
      res.end(data)
    }
  })
  return null
})

// PUT cache item
router.put('/item', function(req, res) {
  // decode key from http header
  const key = decodeKey(req)
  if (!key) {
    res.status(400).json(jerr.BadRequest)
  }

  const exp = decodeExpiration(req) || 0

  const memcached = req.app.locals.memcached
  memcached.set(key, req.body, exp, function(err) {
    if (err) {
      res.status(500).json(jerr.InternalServer)
    } else {
      res.json({ result: true })
    }
  })
})

module.exports = router
