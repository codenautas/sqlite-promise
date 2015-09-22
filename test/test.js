"use strict";

var Promises = require('promise-plus');
var fs=require('fs-promise');
var tester=require('sql-promise-tester');

var MotorSqlite = require('..').Motor;

var defaultConnOpts={
    motor:'test',
    file:'test.db3',
    create: true,
    readWrite: true
};

function prepareFile(){
    var dbFile = defaultConnOpts.file;
    return fs.unlink(dbFile).catch(function(err){
        if(err.code!=='ENOENT'){ throw err; }
    }).then(function(){
        MotorSqlite.connect(defaultConnOpts);
    });
}

tester(MotorSqlite, {
    connOpts: defaultConnOpts, 
    badConnOpts: 'inexis_file.db', 
    prepare:prepareFile
});
