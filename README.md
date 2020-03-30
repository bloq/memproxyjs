# memproxyjs

microservice wrapper for memcached

## Installation

```sh
npm i
```

## API Summary

### **Get Item**: GET /cache/item

Input headers:
`X-MC-Key` should be set to the Base64-encoded key.

Output payload:
application/octet-stream containing cache entry.

HTTP status codes:

- 200, upon success
- 404, if not present or expired
- 5xx, upon server error

### **Put Item**: PUT /cache/item

Input headers:
`X-MC-Key` should be set to the Base64-encoded key.
`X-MC-Exp` specifies the lifetime of the cache entry, in seconds, after which 404-Not-Found will be returned.

Input payload:
application/octet-stream payload to be stored as the cached value.

Output:
application/json payload `{ "result": true }` indicating success.

HTTP status codes:

- 200, upon success
- 5xx, upon server error

### Administration

- **Identity**: GET /
- **Cache stats and health check**: GET /stats

## Authentication

The routes at `/cache` can be set to require basic authentication.
See [Configuration](#configuration) below.

## Configuration

Examines `PORT` environment variable for microservice listen port,
or uses the express app default: 3000.

Examines `UPSTREAM` environment variable for upstream memcached
server location. Multiple upstream servers are not supported.
Default, if not supplied: 127.0.0.1:11211

Examines `AUTH_USER` and `AUTH_PASSWORD` environment variables for enabling authentication on the cache routes when both are set.

## Running

```sh
npm start
```

which runs `bin/www`

## Testing

Before running end-to-end tests, start an instance of `memcached`:

```sh
npm run start:memcached
```

Then run the end-to-end test suite:

```sh
npm run test:e2e
```

Alternatively, run end-to-end coverage tests:

```sh
npm run coverage:e2e
```

Finally, shut down `memcached`:

```sh
docker-compose down
```
