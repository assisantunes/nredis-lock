"use strict";


var assert = require("assert");

var redis = null
    , Lock = null;

before(function(){
  redis = require('redis');
  Lock = require("../lib/index.js")({
    'pubClient': redis.createClient(),
    'subClient': redis.createClient()
  });
});

describe('Lock', function(){
  it('should lock', function(done){
    this.timeout(3000);

    Lock('test-1').then(function(release){
      assert(true);

      setTimeout(function(){
        release();
      }, 1000);
    });

    Lock('test-1').then(null, function(){
      assert(true);
      done();
    });
  });

  it('should wait until release the last lock', function(done){
    this.timeout(3000);

    // Lock using 1000 as timeout
    Lock('test-2', 1000, function(){
      assert(true);
    });

    // should be locked
    Lock('test-2').then(null, function(){
      assert(true);
    });

    // Running after the first lock be released
    Lock('test-2', null, true).then(function(release){
      assert(true);
      release();
      done();
    });

  });

  it('lock should be release any time', function(done){
    this.timeout(4000);

    // Acquiring the lock
    var mylock = Lock('test-3').then(function(){
      assert(true, 'should acquire the lock');

      // Release the lock
      mylock.release().then(function(){
        assert(true, 'lock released');

        Lock('test-3').then(function(release){
          assert(true, 'should acquire the lock after force release');

          done();
        }, function(){
          assert(false, 'the lock should be released');

          done();
        });
      });
    });

  });
});
