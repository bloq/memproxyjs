'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const randomstring = require('randomstring')
const rp = require('request-promise-native')

chai.use(chaiAsPromised).should()

const request = rp.defaults({ json: true })

describe('Memproxy end-to-end', function () {
  let baseUrl = `http://localhost:${process.env.PORT || 3000}`

  before(function() {
    if (!process.env.E2E) {
      this.skip()
    }

    // @ts-ignore
    require('../bin/www')
  })

  it('should retrieve server identity', function () {
    return request({ baseUrl, url: '/' })
      .then(function (res) {
        res.should.have.property('name').that.is.a('string')
        res.should.have.property('version').that.is.a('string')
      })
  })

  it('should retrieve server stats', function () {
    return request({ baseUrl, url: '/stats' })
      .then(function (res) {
        res.should.be.an('array').that.have.lengthOf(1)
        res[0].should.be.an('object')
          .that.include.all.keys('server', 'pid' ,'version')
      })  
  })

  it('should put and get some keys', function () {
    const testObjects = new Array(3)
      .fill(null)
      .map(() => ({ key: randomstring.generate()}))

    return Promise.all(testObjects.map((testObject, i) =>
      request({
        baseUrl, 
        url: `/cache/testObject${i}`, 
        method: 'PUT', 
        body: testObject
      })
    ))
      .then(function (responses) {
        responses.forEach(function (res) {
          res.should.deep.equal({ result: true })
        })
        return Promise.all(testObjects.map((testObject, i) =>
          request({ baseUrl, url: `/cache/testObject${i}` })
          .then(function (res) {
            res.should.deep.equal(testObjects[i])
          })
        ))
      })
  })

  it('should return 404 for missing keys', function () {
    return request({ baseUrl, url: '/cache/missingObject' })
      .should.be.rejectedWith('404')
  })
})