# nredis-lock
  
Simple node.js lock based on Redis

## Installation

    $ npm install nredis-lock

## Initialization

```javascript
var redis = require('redis');

var Lock = require('nredis-lock')({
      'pubClient': redis.createClient(),
      'subClient': redis.createClient()
    });
```

### Lock(lockName, [timeout = 5000], [block = false])

* ``lockName``: Any name for a lock
* ``timeout``: (Optional) The maximum time (in ms) to hold the lock for. If this time is exceeded, the lock is automatically released. Default: 5000 ms (5 seconds).
* ``block``: (Optional) If is `true` the lock will wait until the last lock be released. Default: `false`


## Simple usage

```javascript
// Acquire a lock.
Lock('lock-name').then(function(done){
  // Show time...
  // When you done, release the lock :D
  setTimeout(function(){
    done();
  }, 1000);
}, function(){
  //  there is a lock active
});
```

## Using custom timeout

* the default timeout is 5000 (milliseconds)

```javascript
// Using 3000 milliseconds as timeout
Lock('lock-name', 3000).then(function(done){
}, function(){
});
```

## Waiting the last lock be released

```javascript
Lock('lock-name', null, true).then(function(done){
  done();
});
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
