'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const randomstring = require('randomstring')
const rp = require('request-promise-native')

function b64str(s) {
  const buf = Buffer.from(s)
  const enc = buf.toString('base64')
  return enc
}

chai.use(chaiAsPromised).should()

const request = rp.defaults({ json: true })

describe('Memproxy end-to-end', function() {
  const baseUrl = `http://localhost:${process.env.PORT || 3000}`

  before(function() {
    if (!process.env.E2E) {
      this.skip()
    }

    // @ts-ignore
    require('../bin/www')
  })

  it('should retrieve server identity', function() {
    return request({ baseUrl, url: '/' }).then(function(res) {
      res.should.have.property('name').that.is.a('string')
      res.should.have.property('version').that.is.a('string')
    })
  })

  it('should retrieve server stats', function() {
    return request({ baseUrl, url: '/stats' }).then(function(res) {
      res.should.be.an('array').that.have.lengthOf(1)
      res[0].should.be
        .an('object')
        .that.include.all.keys('server', 'pid', 'version')
    })
  })

  it('should put and get some keys', function() {
    const testObjects = new Array(3)
      .fill(null)
      .map(() => ({ key: randomstring.generate() }))

    return Promise.all(
      testObjects.map((testObject, i) =>
        request({
          baseUrl,
          headers: {
            'X-MC-Key': b64str(`testObject${i}`)
          },
          url: '/cache/item',
          method: 'PUT',
          body: testObject
        })
      )
    ).then(function(responses) {
      responses.forEach(function(res) {
        res.should.deep.equal({ result: true })
      })
      return Promise.all(
        testObjects.map((testObject, i) =>
          request({
            baseUrl,
            headers: {
              'X-MC-Key': b64str(`testObject${i}`)
            },
            url: '/cache/item'
          }).then(function(res) {
            res.should.deep.equal(testObjects[i])
          })
        )
      )
    })
  })

  it('should return 404 for missing keys', function() {
    return request({
      baseUrl,
      headers: {
        'X-MC-Key': b64str('missingObject')
      },
      url: '/cache/item'
    }).should.be.rejectedWith('404')
  })

  it('should return 400 for missing key-header', function() {
    return request({
      baseUrl,
      url: '/cache/item'
    }).should.be.rejectedWith('400')
  })

  it('should return 404 for expired items', function() {
    this.timeout(4000 * 2)
    const testObject = 'testObjectExp'
    return request({
      baseUrl,
      headers: {
        'X-MC-Key': b64str(testObject),
        'X-MC-Exp': '3'
      },
      url: '/cache/item',
      method: 'PUT',
      body: testObject
    })
      .then(function(res) {
        res.should.deep.equal({ result: true })
        return new Promise((resolve, reject) => {
          setTimeout(function() {
            resolve()
          }, 4000)
        })
      })
      .then(function() {
        return request({
          baseUrl,
          headers: {
            'X-MC-Key': b64str(testObject)
          },
          url: '/cache/item'
        }).should.be.rejectedWith('404')
      })
  })
})
