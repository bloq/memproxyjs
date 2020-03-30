'use strict'

const express = require('express')
const logger = require('morgan')
const Memcached = require('memcached')
const debug = require('debug')('memcache-proxy:app')
const basicAuth = require('express-basic-auth')

const indexRouter = require('./routes/index')
const cacheRouter = require('./routes/cache')

const app = express()

const { AUTH_USER, AUTH_PASS, UPSTREAM = '127.0.0.1:11211' } = process.env

debug('Connecting to memcached at %s', UPSTREAM)
app.locals.memcached = new Memcached(UPSTREAM)

app.use(logger('dev'))

app.use('/', indexRouter)

if (AUTH_USER && AUTH_PASS) {
  const auth = basicAuth({
    unauthorizedResponse: 'Unauthorized',
    users: { [AUTH_USER]: AUTH_PASS }
  })
  app.use('/cache', auth)
  debug('Authentication enabled')
}

app.use('/cache', cacheRouter)

module.exports = app
