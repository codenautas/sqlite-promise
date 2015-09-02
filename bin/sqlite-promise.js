"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var sqlitePromise = {};

var sqlite3 = require('sqlite3');
var fs = require('fs-promise');
var Promises = require('best-promise');
var util = require('util');

sqlitePromise.defaultPort=null;

sqlitePromise.connect = function connect(connOpts){
    return Promises.make(function(resolve,reject){
        var db=new sqlite3.Database(connOpts, sqlite3.OPEN_READWRITE,function(err){
            if(err){
                reject(err);
            }else{
                resolve(new sqlitePromise.Client(db));
            }
        });
    });
};

sqlitePromise.Client = function Client(_db){
    var self = this;
    this.db = _db;
    this.done = function done(){
        this.db.close();
    }
    this.query = function query(){
        return new sqlitePromise.Query(arguments, self);
    }
}

sqlitePromise.Query = function Query(queryArguments, client){
    this.execute = function execute(){
        return Promises.make(function(resolve, reject){
            var newArguments = Array.prototype.slice.call(queryArguments, 0).concat(function(err){
                if(err){
                    reject(err);
                }else{
                    resolve({rowCount: this.changes});
                }
            });
            console.log('newArguments', newArguments);
            client.db.run.apply(client.db, newArguments);
        });
    }
}

module.exports = sqlitePromise;
