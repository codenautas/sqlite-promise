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
    return new fs.exists(connOpts).then(function(exist){
        if(exist || connOpts==':memory:'){
            return new sqlite3.Database(connOpts);
        }else{
            throw new Error('sqlite3: '+connOpts+' database does not exist');
        }
    });
}

module.exports = sqlitePromise;
