"use strict";

var tester=require('sql-promise-tester');
var fs=require('fs-promise');

var sqlite3 = require('sqlite3');

var sqlite = require('..');

var dbFile='local-database.db';

function prepareFile(){
    return fs.unlink(dbFile).catch(function(err){
        if(err.code!=='ENOENT'){
            throw err;
        }
    }).then(function(){
        console.log('creando ',dbFile);
        var db = new sqlite3.Database(dbFile); // uso un archivo real para poder mirarlo
        console.log(db);
        db.run("CREATE TABLE lorem (info TEXT)");
        return null; //ok
    });
}

tester(sqlite, {
    connOpts: dbFile, 
    badConnOpts: 'inexis_file.db', 
    prepare:prepareFile,
    testUntil:'connect'
});