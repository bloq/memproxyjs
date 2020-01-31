
'use strict';

const BASEURL = 'http://127.0.0.1:3000';
const request = require('request');

async function api_call(options)
{
	return new Promise((resolve,reject) => {
		request(options, function(err,res,body) {
			if (err)
				reject(err);
			else if (res.statusCode != 200)
				reject(body);
			else
				resolve(body);
		});
	});
}

async function api_get(key)
{
	const options = {
		url: BASEURL + '/cache/' + key,
		method: 'GET',
	};

	return api_call(options);
}

async function api_put(key, data)
{
	const options = {
		url: BASEURL + '/cache/' + key,
		method: 'PUT',
		body: data,
		headers: {
			'Content-Type':'application/octet-stream',
			'Content-Length': data.length,
		}
	};

	return api_call(options);
}

async function test_getset()
{
	const testkey = 'testkey';
	const testval = 'testvalue';

	await api_put(testkey, testval);

	try {
		const rv = await api_get(testkey);
		console.log("RETURNVAL:");
		console.log(rv);
	}
	catch (err) {
		console.error("ERRFAIL:");
		console.error(err);
	}
}

(async () => {
    await test_getset();
})();
