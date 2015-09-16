"use strict";

var Promises = require('best-promise');
var fs=require('fs-promise');
var tester=require('sql-promise-tester');

var MotorSqlite = require('..').Motor;

var defaultConnOpts={
    file:'test.db3',
    //file:':memory:',
    //create: true,
    readWrite: true
};

var motor = MotorSqlite;

function prepareFile(){
    var dbFile = defaultConnOpts.file;
    return fs.unlink(dbFile).catch(function(err){
        if(err.code!=='ENOENT'){
            throw err;
        }
    }).then(function(){
        console.log('creando ',dbFile);
        var sqlite3 = require('..').sqlite3;
        var db = new sqlite3.Database(dbFile, sqlite3.OPEN_CREATE |sqlite3.OPEN_READWRITE); // uso un archivo real para poder mirarlo
        console.log(db);
        db.serialize(function() {
            db.run("CREATE TABLE lorem (info TEXT)");
            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();
        });
        db.close();
        console.log("prepareFile() done");
        return null; //ok
    }).catch(function(err) {
        console.log("ERROR", err.stack);
        throw err;
    });
}

prepareFile().then(function() {
    console.log("listo");
}).then(function() {
    return motor.connect(defaultConnOpts);
}).then(function(con) {
    return motor.prepare(con, "SELECT * FROM sqlite_master WHERE type='table'");
    //return motor.prepare(con, "SELECT info FROM lorem WHERE 1");
}).then(function(prepared) {
    // console.log("prepared", prepared);
    return motor.query(prepared, "");
}).then(function(query) {
    // console.log("query", query);
    return motor.fetchAll(query);
}).then(function(result) {
    console.log("result", result); 
}).catch(function(err) {
    console.log("err", err.stack);
});    

/*
describe('internal test', function() {
    before(function(done) {
       prepareFile().then(done, done); 
    });
    it('must perform a simple select', function(done) {
        done();
        // motor.connect(defaultConnOpts).then(function(con) {
            // console.log("con", con);
            // return motor.prepare(con, "SELECT * FROM lorem;");
        // }).then(function(prepared) {
            // console.log("prepared", prepared);
            // return motor.query(prepared, "");
        // }).then(function(query) {
            // console.log("query", query);
            // return motor.fetchAll(query);
        // }).then(function(result) {
            // console.log("result", result); 
        // }).catch(function(err) {
            // console.log("err", err.stack);
        // });        
    });
});
*/

// var tester=require('sql-promise-tester');
// var fs=require('fs-promise');

// var sqlite3 = require('sqlite3');

// var sqlite = require('..');

// var dbFile='local-database.db';

// function prepareFile(){
    // return fs.unlink(dbFile).catch(function(err){
        // if(err.code!=='ENOENT'){
            // throw err;
        // }
    // }).then(function(){
        // console.log('creando ',dbFile);
        // var db = new sqlite3.Database(dbFile); // uso un archivo real para poder mirarlo
        // console.log(db);
        // db.run("CREATE TABLE lorem (info TEXT)");
        // return null; //ok
    // });
// }

// tester(sqlite, {
    // connOpts: dbFile, 
    // badConnOpts: 'inexis_file.db', 
    // prepare:prepareFile,
    // testUntil:'end'
// });
