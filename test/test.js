"use strict";

var Promises = require('best-promise');
var fs=require('fs-promise');
var tester=require('sql-promise-tester');

var MotorSqlite = require('..').Motor;

var defaultConnOpts={
    motor:'test',
    file:'test.db3',
    //file:':memory:',
    //create: true,
    readWrite: true
};

function prepareFile(){
    var dbFile = defaultConnOpts.file;
    return fs.unlink(dbFile).catch(function(err){
        if(err.code!=='ENOENT'){
            throw err;
        }
    }).then(function(){
        //console.log('creando ',dbFile);
        var sqlite3 = require('..').sqlite3;
        var db = new sqlite3.Database(dbFile, sqlite3.OPEN_CREATE |sqlite3.OPEN_READWRITE); // uso un archivo real para poder mirarlo
        //console.log(db);
        db.serialize(function() {
            db.run("CREATE TABLE lorem (info TEXT)");
            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();
        });
        db.close();
        return null; //ok
    }).catch(function(err) {
        console.log("ERROR", err.stack);
        throw err;
    });
}

// descomentar esto para ejecutar "npm run test-direct" !!
/*
prepareFile().then(function() {
    return MotorSqlite.connect(defaultConnOpts);
}).then(function(con) {
    return MotorSqlite.prepare(con, "SELECT * FROM sqlite_master WHERE type='table'");
    //return MotorSqlite.prepare(con, "SELECT info FROM lorem WHERE 1");
}).then(function(prepared) {
    // console.log("prepared", prepared);
    return MotorSqlite.query(prepared, "");
}).then(function(query) {
    // console.log("query", query);
    return MotorSqlite.fetchAll(query);
}).then(function(result) {
    console.log("result", result); 
}).catch(function(err) {
    console.log("err", err.stack);
});    
*/

tester(MotorSqlite, {
    connOpts: defaultConnOpts, 
    badConnOpts: 'inexis_file.db', 
    prepare:prepareFile,
    testUntil:'connect'
});
