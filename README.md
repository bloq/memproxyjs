# memproxyjs
microservice wrapper for memcached

## Installation

```
$ npm i
```

## Configuration

Examines `PORT` environment variable for microservice listen port,
or uses the express app default: 3000.

Examines `UPSTREAM` environment variable for upstream memcached
server location.  Multiple upstream servers are not supported.
Default, if not supplied: 127.0.0.1:11211

## Running

```
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
