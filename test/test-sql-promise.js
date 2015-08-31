"use strict";

var tester=require('sql-promise').tester;

var sqlite = require('..');

tester.test(sqlite, {connOpts: ':memory:', badConnOpts: 'inexis_file.db'});