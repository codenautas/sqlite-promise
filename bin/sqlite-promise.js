"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var sqlitePromise = {};

var Promises = require('best-promise');
var sqlite3 = require('sqlite3').verbose();

sqlitePromise.Motor = function SqliteMotor(){
}

sqlitePromise.sqlite3 = sqlite3;

function applyToConstructor(constructor, argArray) {
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
}

sqlitePromise.Motor.connect = function connect(connectParameters){
    return Promises.make(function(resolve, reject){
        var mode = 0;
        if(connectParameters.create) { mode |= sqlite3.OPEN_CREATE; }
        if(connectParameters.readWrite || !mode) { mode |= sqlite3.OPEN_READWRITE; }
        var con = new sqlite3.Database(connectParameters.file, mode, function(err) {
            if(err) {
                reject(err);
            } else {
                resolve(con);
            }
        });
    });
};

sqlitePromise.Motor.done = function connect(internal){
    return Promises.start(function(){
        return internal.done();
    });
};

sqlitePromise.Motor.prepare = function prepare(internal, sqlSentence){
    return Promises.make(function(resolve, reject) {
        var stmt = internal.prepare(sqlSentence, function(err) {
            if(err) {
                reject(err);
            } else {
                resolve({
                   conn:internal,
                   stmt:stmt,
                   sql:sqlSentence
                });
            }
        });
    });
};

sqlitePromise.Motor.query = function query(internal, data){
    return Promises.start(function() {
       return {
            conn:internal.conn,
            stmt:internal.stmt,
            sql:internal.sql,
            data:data
        };
    });
};

sqlitePromise.Motor.fetchAll = function fetchAll(internal){
    return Promises.make(function(resolve, reject){
        internal.stmt.all(function(err, result){
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

module.exports = sqlitePromise;
