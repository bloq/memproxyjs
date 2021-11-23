'use strict'

const BASEURL = 'http://127.0.0.1:3000'
const request = require('request')

const apiCall = async (options) => new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if (err) {reject(err)}
      else if (res.statusCode !== 200) {reject(body)}
      else {resolve(body)}
    })
  });

async function apiGet(key) {
  const options = {
    url: `${BASEURL}/cache/${key}`,
    method: 'GET'
  }

  return apiCall(options)
}

async function apiPut(key, data) {
  const options = {
    url: `${BASEURL}/cache/${key}`,
    method: 'PUT',
    body: data,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': data.length
    }
  }

  return apiCall(options)
}

async function testGetSet() {
  const testkey = 'testkey'
  const testval = 'testvalue'

  await apiPut(testkey, testval)

  try {
    const rv = await apiGet(testkey)
    console.log('RETURNVAL:')
    console.log(rv)
  } catch (err) {
    console.error('ERRFAIL:')
    console.error(err)
  }
}

(async function() {
  await testGetSet()
})()
