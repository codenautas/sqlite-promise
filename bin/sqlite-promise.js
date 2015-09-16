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

/*
function SqliteConnection(params) {
    this.db = new sqlite3.Database(params, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, function(err) {
        console.log("*****", err);
        if(err) { this.error = err; }
    });
    this.close = function() {
        this.db.close();
    }
};

function SqlitePreparedQuery(conn, sql) {
    this.conn = conn;
    this.stmt = conn.db.prepare(sql, function(err) {
        if(err) { this.error = err; }
    });
    
    this.sql = sql;
};

function SqliteResult(rows) {
    this.rows = rows;
    this.rowCount = rows.length;
};

function SqliteQuery(preparedQuery, data) {
    this.conn = preparedQuery.conn;
    this.stmt = preparedQuery.stmt;
    this.data = data;
    this.fetch = function fetch() {
        try {
        var f=this.stmt.run(this.data, function(err, row) {
            console.log("run", err, row);
            if(err) {
                console.log("fetch err", err);
                throw Error(err)
            } else {
                return new SqliteResult(row);
            }
        });
            
        }catch(e) {
            console.log("fetch mal", e);
        }
        console.log("f", f);
    };
};

sqlitePromise.Motor = function SQLiteMotor() {
    this.connect=function(params) {
        if(! params) {
            return Promises.reject("SQLiteMotor: null params");
        }
        return Promises.make(function(resolve, reject){
            var con = new SqliteConnection(params);
            if(con.error) {
                reject(con.error);
            } else{
                resolve(con);
            }
        });
    };
    this.prepare=function(con, sql) {
        return Promises.make(function(resolve, reject){
            var prepQ = new SqlitePreparedQuery(con, sql);
            if(prepQ.error) {
                reject(prepQ.error);
            } else{
                resolve(prepQ);
            }
        });
    };
    this.query=function(preparedQuery, data) {
        return Promises.make(function(resolve, reject){
            var query = new SqliteQuery(preparedQuery, data);
            if(query.error) {
                reject(query.error);
            } else{
                resolve(query);
            }
        });
    };
    this.fetchAll=function(query) {
        return Promises.make(function(resolve, reject){
            try {
                var res = query.fetch();
                console.log("res", res);
                resolve(res);
            } catch(err) {
                reject(err);
            }
        });
    };
};
*/

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
