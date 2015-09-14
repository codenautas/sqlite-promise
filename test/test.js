"use strict";

var sp = require('..');

var motor = new sp.Motor;

// motor.connect("local-database.db").then(function(con) {
    // console.log("con", con);
    // return motor.exec(con, "CREATE table t1(id integer, name varchar);");
// }).then(function(r) {
    // console.log("res", r);
    // motor.close();
// }).catch(function(err) {
    // console.log("err", err);
// });

motor.connect("local-database.db").then(function(con) {
    console.log("con", con);
    return motor.prepare(con, "CREATE table t1(id integer, name varchar);");
}).then(function(prepared) {
    console.log("prepared", prepared);
    return motor.query(prepared, "dummy");
}).then(function(query) {
    console.log("query", query);
    return motor.fetchRowByRow(query, function(row) {
       console.log("row", row); 
    }).then(function(algo) {
        console.log("algo", algo);
    }).then(function(){
        motor.close();
    });
}).catch(function(err) {
    console.log("err", err.stack);
});


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