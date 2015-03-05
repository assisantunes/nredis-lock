"use strict";


var Promise = require('promise')
  , inherit = require('inherit');


var Lock = (function(){
    var __constructor = function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }

    var __class = inherit({
        __constructor: function(clients, retryDelay){
            var self = this;
            self.pubClient = clients.pubClient;
            self.subClient = clients.subClient;
            self.pubClient.CONFIG('SET', 'notify-keyspace-events', 'Kxg');

            self.retryDelay = retryDelay || 50;
        },
        acquire:function(name, timeout, block){
            var self = this;
            timeout = timeout || 10000;
            block = block!==undefined?block:false;

            var p = new Promise(function(resolve, reject){

                self.pubClient.SET(self.__name(name), true, 'PX', timeout, 'NX', function(err, result) {
                    if(err) return self.__retry(function(){
                        self.acquire(name, timeout, block).then(resolve, reject);
                    });

                    if(result === null){
                        if(!block){
                            reject('locked');
                            return;
                        }

                        var subchannel = '__keyspace@*__:'+self.__name(name);

                        self.subClient.PSUBSCRIBE(subchannel);
                        self.subClient.on("pmessage", function (pchannel, channel, action){
                            if(subchannel==pchannel && ['del', 'expired'].indexOf(action)!=-1){
                                resolve(self.acquire(name, timeout, block).release);
                            }
                        });
                    }else{
                        resolve(p.release);
                    }
                });

            });
            
            p.release = function(){ 
                return self.release(name);
            }
            return p;
        },
        release:function(name){
            var self = this;

            var p = new Promise(function(resolve, reject){
                self.pubClient.DEL(self.__name(name), function(err, result) {
                    if(err) return self.__retry(function(){
                        self.release(name).then(resolve, reject);
                    });

                    resolve();
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
    return __constructor(__class, arguments);
});


module.exports = function(clients, retryDelay){
    var lock = new Lock(clients, retryDelay);
    return function(){
        return lock.acquire.apply(lock, arguments);
    }
};