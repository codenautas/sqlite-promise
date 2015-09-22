"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var sqlitePromise = {};

var Promises = require('promise-plus');
var sqlite3 = require('sqlite3').verbose();

sqlitePromise.Motor = function SqliteMotor(){};
sqlitePromise.Motor.motorName = 'SQLitePromise';
sqlitePromise.Motor.defaultPort = 0;

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

sqlitePromise.Motor.done = function done(internal){
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
        internal.stmt.all(internal.data || [], function(err, rows){
            if(err){
                reject(err);
            }else{
                resolve({rowCount:rows.length||1, rows:rows});
            }
        });
    });
};

sqlitePromise.Motor.fetchRowByRow = function fetchAll(internal, functions){
    return Promises.make(function(resolve, reject){
        internal.stmt.each(internal.data || [],
            function(err, row) {
                if(err){
                    reject(err);
                }else{
                    functions.onRow(row);
                }
            },
            function(err, numRows) {
                if(err) {
                    reject(err);
                } else {
                    functions.onEnd();
                    resolve({rowCount:numRows});   
                }
            }
        );
    });
};

sqlitePromise.Motor.placeHolder = function placeHolder(n){
    return '$'+n;
};

module.exports = sqlitePromise;
