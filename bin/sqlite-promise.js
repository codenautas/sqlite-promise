"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var sqlitePromise = {};

var Promises = require('best-promise');
var sqlPromise = require('sql-promise');
var sqlite3 = require('sqlite3').verbose();

function SqliteConnection(params) {
    sqlPromise.DbPreparedQuery.call(this);
    this.internalState.db = new sqlite3.Database(params, sqlite3.OPEN_READWRITE, function(err) {
        if(err) { this.internalState.error = err; }
    });
    this.close = function() {
        this.internalState.db.close();
    }
};

function SqlitePreparedQuery(conn, sql) {
    sqlPromise.DbConnection.call(this);
    this.internalState.conn = conn.internalState;
    this.internalState.stmt = conn.internalState.db.prepare(sql, function(err) {
        if(err) { this.internalState.error = err; }
    });
    
    this.internalState.sql = sql;
};

function SqliteQuery(preparedQuery, data) {
    sqlPromise.DbQuery.call(this);
    this.internalState = preparedQuery.internalState;
    this.internalState.data = data;
    this.fetch = function fetch(callbackRowByRow) {
        var f=this.internalState.stmt.run(function(err, row) {
            if(err) {
                //this.internalState.error = err;
                throw Error(err)
            } else {
                console.log("fetched ok", row);
                callbackRowByRow(row);
            }
        });
    };
};


function SqliteResult(row) {
    sqlPromise.DbResult.call(this);
    this.internalState = row;
};

sqlitePromise.Motor = function SQLiteMotor() {
    this.connect=function(params) {
        if(! params) {
            return Promises.reject("SQLiteMotor: null params");
        }
        return Promises.make(function(resolve, reject){
            var con = new SqliteConnection(params);
            if(con.internalState.error) {
                reject(con.internalState.error);
            } else{
                resolve(con);
            }
        });
    };
    this.prepare=function(con, sql) {
        return Promises.make(function(resolve, reject){
            var prepQ = new SqlitePreparedQuery(con, sql);
            if(prepQ.internalState.error) {
                reject(prepQ.internalState.error);
            } else{
                resolve(prepQ);
            }
        });
    };
    this.query=function(preparedQuery, data) {
        return Promises.make(function(resolve, reject){
            var query = new SqliteQuery(preparedQuery, data);
            if(query.internalState.error) {
                reject(query.internalState.error);
            } else{
                resolve(query);
            }
        });
    };
    this.fetchRowByRow=function(query, callbackRowByRow) {
        return Promises.make(function(resolve, reject){
            try {
                console.log("FRBR");
                query.fetch(callbackRowByRow);
                console.log("FUE");
            } catch(err) {
                console.log("FRBR", err);
                reject(err);
            }
        });
    };
    this.exec=function(con, sql) {
        return Promises.make(function(resolve, reject){
            var e = con.internalState.db.run(sql);
            if(e) {
                reject(e);
            } else{
                resolve("ok");
            }
        });
    };
};


// sqlitePromise = Object.create(sqlPromise);

// sqlitePromise.motorName = 'sqlite3';

// sqlitePromise.debug={};

// var sqlite3 = require('sqlite3');
// var fs = require('fs-promise');
// var Promises = require('best-promise');
// var util = require('util');

// sqlitePromise.defaultPort=null;

// sqlitePromise.getQuery = function getQuery(internalConnection, queryArguments){
    // return {internalConnection:internalConnection, queryArguments:queryArguments};
// }

// sqlitePromise.Client = function Client(_db){
    // var self = this;
    // this.db = _db;
    // this.done = function done(){
        // console.log('SQLITE3 close');
        // this.db.close();
    // }
    // this.query = function query(){
        // return new sqlitePromise.Query(arguments, self);
    // }
// };

// sqlitePromise.makePromiseFetcher = function makePromiseFetcher(internalQuery, callbackForEachRow, ender){
    // return Promises.make(function(resolve, reject){
        // var functionName;
        // var args=Array.prototype.slice.call(internalQuery.queryArguments,0);
        // if(callbackForEachRow){
            // functionName='each';
            // args.push(function(err, row){
                // if(err){
                    // reject(err);
                // }
                // callbackForEachRow(row);
            // });
        // }else{
            // functionName='all';
        // }
        // args.push(function(err, result){
            // console.log('termino',err, result);
            // if(err){
                // reject(err);
            // }
            // ender(result, resolve, reject);
        // });
        // console.log(functionName,args);
        // internalQuery.internalConnection[functionName].apply(internalQuery.internalConnection, args);
    // });
// };

// /*
// sqlitePromise.Query = function Query(queryArguments, client){
    // this.execute = function execute(adapterName){
        // var adapter = sqlitePromise.queryAdapters[adapterName||'normal'];
        // return Promises.make(function(resolve, reject){
            // var newArguments = Array.prototype.slice.call(queryArguments, 0).concat(function(err){
                // if(err){
                    // reject(err);
                // }else{
                    // resolve({rowCount: this.changes});
                // }
            // });
            // console.log('newArguments', newArguments);
            // client.db.run.apply(client.db, newArguments);
        // });
    // }
    // this.fetchAll            = this.execute.bind(this,'normal');
// }
// */

// sqlitePromise.connect = function connect(connOpts){
    // return Promises.make(function(resolve,reject){
        // var connection=new sqlite3.Database(connOpts, sqlite3.OPEN_READWRITE,function(err){
            // if(err){
                // reject(err);
            // }else{
                // resolve(new sqlitePromise.Connection('opened', connection, connection.close, sqlitePromise));
            // }
        // });
    // });
// };

module.exports = sqlitePromise;
