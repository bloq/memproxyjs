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

