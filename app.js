'use strict'

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const Memcached = require('memcached')

const indexRouter = require('./routes/index')
const cacheRouter = require('./routes/cache')

const app = express()

const upstream = process.env.UPSTREAM || '127.0.0.1:11211'
app.locals.memcached = new Memcached(upstream)

app.use(logger('dev'))

app.use('/', indexRouter)
app.use('/cache', cacheRouter)

module.exports = app
