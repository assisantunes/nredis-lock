"use strict";

var assert = require("assert")
    , redis = null
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

        Lock('test-1')
            .acquire()
            .then(function(release){
                assert(true);

                setTimeout(function(){
                    release();
                }, 1000);
            });

        Lock('test-1')
            .acquire()
            .then(null, function(){
                assert(true);
                done();
            });
    });

    it('should wait until release the last lock', function(done){
        this.timeout(3000);

        // Lock using 1000 as timeout
        Lock('test-2', 1000)
            .acquire()
            .then(function(){
                assert(true);
            }, function(){
                assert(false, 'should acquire the lock');
            });

        // should be locked
        Lock('test-2')
            .acquire()
            .then(function(){
                assert(false, 'should not acquire the lock');
            }, function(){
                assert(true);
            });

        // Running after the first lock be released
        Lock('test-2', null, true)
            .acquire()
            .then(function(release){
                done();
                release();
            });
    });

    it('lock should be release any time', function(done){
        this.timeout(4000);

        var mylock = Lock('test-3');

        // Acquiring the lock
        mylock.acquire()
            .then(function(){
                assert(true, 'should acquire the lock');

                // Release the lock
                mylock.release().then(function(){
                    assert(true, 'lock released');

                    Lock('test-3')
                        .acquire()
                        .then(function(release){
                            assert(true, 'should acquire the lock after force release');

                            done();
                        }, function(){
                            assert(false, 'the lock should be released');

                            done();
                        });
                }, function(){
                    assert(false, 'should have lock to release');

                    done();
                });
            }, function(){
                assert(false, 'should acquire the lock');

                done();
            });
    });

    it('test no lock to be released', function(done){
        this.timeout(4000);

        Lock('test-4')
            .release()
            .then(function(){
                assert(false, 'should have no lock to be released');

                done();
            }, function(){
                assert(true, 'no lock to be released');

                done();
            });
    });
});
