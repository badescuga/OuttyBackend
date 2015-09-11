//var db = require('./db.js');
import * as  db from './db'
import * as  testAsync from './testStorageAsync'

console.log(` test:  ${ db.tt } ` +db.tt);

async function loginUser(data, callback) {

};

async function createGroup(data, callback) {

};

async function getGroup(data, callback) {

};

async function getGroupMessages(data, callback) {

};


module.exports = {
	loginUser: loginUser
};