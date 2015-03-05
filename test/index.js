var assert = require("assert");

describe('Lock', function(){
  it('should lock', function(done){
    this.timeout(3000);

    var redis = require('redis');
    var Lock = require("../lib/index.js")({
      'pubClient': redis.createClient(),
      'subClient': redis.createClient()
    });

    Lock('test').then(function(release){
      assert(true);
      setTimeout(function(){
        release();
      }, 1000);
    });

    Lock('test').then(null, function(){
      assert(true);
      done();
    });
  });

  it('should wait until release the last lock', function(done){
    this.timeout(3000);

    var redis = require('redis');
    var Lock = require("../lib/index.js")({
      'pubClient': redis.createClient(),
      'subClient': redis.createClient()
    });

    // Lock using 1000 as timeout
    Lock('test', 1000, function(){
      assert(true);
    });

    // should be locked
    Lock('test').then(null, function(){
      assert(true);
    });

    // Running after the first lock be released
    Lock('test', null, true).then(function(release){
      assert(true);
      release();
      done();
    });

  });
});