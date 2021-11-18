'use strict'

const { promisify } = require('util')
const express = require('express')
const router = express.Router()
const jerr = require('../error')
const bodyParser = require('body-parser')
const validator = require('validator')

router.use(bodyParser.raw({ type: '*/*', limit: '50mb' }))

function decodeKey(req) {
  const rawHeader = req.header('X-MC-Key')
  if (!rawHeader || !validator.isBase64(rawHeader)) {return null}
  const buf = Buffer.from(rawHeader, 'base64')
  return buf
}

function decodeExpiration(req) {
  const rawHeader = req.header('X-MC-Exp')
  if (!rawHeader || !validator.isInt(rawHeader)) {return null}
  const exp = parseInt(rawHeader)
  if (exp < 0) {return null}
  return exp
}


// GET cache item
router.get('/item', function (req, res) {
  // decode key from http header
  const key = decodeKey(req)
  if (!key) {
    return res.status(400).json(jerr.BadRequest)
  }

  // call memcached with key
  const memcached = req.app.locals.memcached
  memcached.get(key, function (err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer)
    } else if (!data || !data.length) {
      res.status(404).json(jerr.NotFound)
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': data.length,
      })
      res.end(data)
    }
  })
  return null
})

// GET multiple cache items
router.post('/getitems', function (req, res) {
  const keys = JSON.parse(req.body)
  const memcached = req.app.locals.memcached
  if(!Array.isArray(keys)) {
    res.status(400).json(jerr.BadRequest)
    return
  }

  memcached.getMulti(keys, function (err, data) {
    if (err) {
      res.status(500).json(jerr.InternalServer)
    } else {
      Object.keys(data).forEach(function(k) {
        data[k] = data[k].toString()
      })
      res.json(data)
    }
  })
})

// PUT cache item
router.put('/item', function (req, res) {
  // decode key from http header
  const key = decodeKey(req)
  if (!key) {
    res.status(400).json(jerr.BadRequest)
  }

  const exp = decodeExpiration(req) || 0

  const memcached = req.app.locals.memcached
  memcached.set(key, req.body, exp, function (err) {
    if (err) {
      res.status(500).json(jerr.InternalServer)
    } else {
      res.json({ result: true })
    }
  })
})

// PUT multiple cache items
router.put('/items', function (req, res) {
  const items = JSON.parse(req.body)
  const memcached = req.app.locals.memcached
  const setPromise = promisify(memcached.set).bind(memcached)

  if(!Array.isArray(items)) {
    return res.status(400).json(jerr.BadRequest)
  }

  return Promise.allSettled(
      items.map(({key, value, exp = 0}) => setPromise(key, value, exp))
    )
    .then(results => {
      if(results.find(r => r.status === 'rejected')) {
        throw Error('Set promise rejected')
      }
      res.json({ result: true })
    })
    .catch(() => res.status(500).json(jerr.InternalServer))
})

module.exports = router
