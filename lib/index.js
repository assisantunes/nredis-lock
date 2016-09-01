"use strict";


var Promise = require('promise')
    , inherit = require('inherit');


var Lock = (function(){
    var __class = inherit({
        __constructor: function(pubClient, retryDelay){
            var self = this;
            self.pubClient = pubClient;

            self.retryDelay = retryDelay || 50;
        },
        acquire:function(name, timeout){
            var self = this;
            timeout = timeout || 10000;

            var p = new Promise(function(resolve, reject){

                self.pubClient.SET(self.__name(name), true, 'PX', timeout, 'NX', function(err, result) {
                    if(err) return self.__retry(function(){
                        self.acquire(name, timeout).then(resolve, reject);
                    });

                    if(result === null){
                        return reject('locked');
                    }else{
                        return resolve(function(){
                            self.release(name);
                        });
                    }
                });

            });

            return p;
        },
        release:function(name){
            var self = this;

            var p = new Promise(function(resolve, reject){
                self.pubClient.DEL(self.__name(name), function(err, result) {
                    if(err) return self.__retry(function(){
                        self.release(name).then(resolve, reject);
                    });

                    if(result)  resolve();
                    else        reject();
                });
            });

            return p;
        },
        __name:function(name){
            return 'lock:'+name;
        },
        __retry:function(fun){
            var self = this;
            setTimeout(function() {
                if(typeof fun=='function') fun();
            }, self.retryDelay);
        }
    });

    return (function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    })(__class, arguments);
});


module.exports = function(clients, retryDelay){
    var lock = new Lock(clients, retryDelay);
    return function(){
        var _arguments = arguments;
        return {
            acquire:function(){
                return lock.acquire.apply(lock, _arguments);
            },
            release:function(){
                return lock.release.apply(lock, _arguments);
            }
        }
    }
};
