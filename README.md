# nredis-lock [![HackHands Live Coding Help](https://img.shields.io/badge/live%20coding%20help-online-brightgreen.svg)](https://hackhands.com/assisantunes) [![Build Status](https://travis-ci.org/assisantunes/nredis-lock.png)](https://travis-ci.org/assisantunes/nredis-lock) [![npm version](https://badge.fury.io/js/nredis-lock.svg)](http://badge.fury.io/js/nredis-lock) 


Simple node.js lock based on Redis
 
[![NPM](https://nodei.co/npm/nredis-lock.png)](https://nodei.co/npm/nredis-lock/)

## Features

- For better server compatibility this module doesn't use redis scripts

## Installation

	$ npm install nredis-lock

## Initialization

```javascript
var redis = require('redis');

var Lock = require('nredis-lock')(redis.createClient());
```

### Lock(lockName, [timeout = 5000])

* ``lockName``: Any name for a lock
* ``timeout``: (Optional) The maximum time (in ms) to hold the lock for. If this time is exceeded, the lock is automatically released. Default: 10000 ms (10 seconds).


## Simple usage

```javascript
// Acquire a lock.
Lock('lock-name')
	.acquire()
	.then(function(done){
		// Show time...
		// When you done, release the lock :D
		setTimeout(function(){
			done();
		}, 1000);
	}, function(){
		// There is a lock active
	});
```

## Using custom timeout

* the default timeout is 5000 (milliseconds)

```javascript
// Using 3000 milliseconds as timeout
Lock('lock-name', 3000)
	.acquire()
	.then(function(done){
	}, function(){
	});
```

## Release the lock any time

```javascript
Lock('lock-name')
	.release()
	.then(function(){
		// Lock released
	}, function(){
		// No lock to release
	})
```

## Tests

Require: `redis-server` running

	$ npm test

## Author

Assis Antunes &lt;assixantunes@gmail.com&gt;


# License
(The MIT License)

Copyright (c) 2015 Assis Antunes (assixantunes@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
