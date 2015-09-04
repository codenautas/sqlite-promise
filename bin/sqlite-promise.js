"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var sqlitePromise = {};

var sqlPromise = require('sql-promise');

sqlitePromise = Object.create(sqlPromise);

sqlitePromise.motorName = 'sqlite3';

sqlitePromise.debug={};

var sqlite3 = require('sqlite3');
var fs = require('fs-promise');
var Promises = require('best-promise');
var util = require('util');

sqlitePromise.defaultPort=null;

sqlitePromise.getQuery = function getQuery(internalConnection, queryArguments){
    return {internalConnection:internalConnection, queryArguments:queryArguments};
}

sqlitePromise.Client = function Client(_db){
    var self = this;
    this.db = _db;
    this.done = function done(){
        console.log('SQLITE3 close');
        this.db.close();
    }
    this.query = function query(){
        return new sqlitePromise.Query(arguments, self);
    }
};

sqlitePromise.makePromiseFetcher = function makePromiseFetcher(internalQuery, callbackForEachRow, ender){
    return Promises.make(function(resolve, reject){
        var functionName;
        var args=Array.prototype.slice.call(internalQuery.queryArguments,0);
        if(callbackForEachRow){
            functionName='each';
            args.push(function(err, row){
                if(err){
                    reject(err);
                }
                callbackForEachRow(row);
            });
        }else{
            functionName='all';
        }
        args.push(function(err, result){
            console.log('termino',err, result);
            if(err){
                reject(err);
            }
            ender(result, resolve, reject);
        });
        console.log(functionName,args);
        internalQuery.internalConnection[functionName].apply(internalQuery.internalConnection, args);
    });
};

/*
sqlitePromise.Query = function Query(queryArguments, client){
    this.execute = function execute(adapterName){
        var adapter = sqlitePromise.queryAdapters[adapterName||'normal'];
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
    this.fetchAll            = this.execute.bind(this,'normal');
}
*/

sqlitePromise.connect = function connect(connOpts){
    return Promises.make(function(resolve,reject){
        var connection=new sqlite3.Database(connOpts, sqlite3.OPEN_READWRITE,function(err){
            if(err){
                reject(err);
            }else{
                resolve(new sqlitePromise.Connection('opened', connection, connection.close, sqlitePromise));
            }
        });
    });
};

module.exports = sqlitePromise;
