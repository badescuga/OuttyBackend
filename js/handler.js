//var db = require('./db.js');
import * as  db from './db.js'
console.log(` test:  ${ db.tt } ` + db.tt);


async function loginUser(data, callback) {

};


module.exports = {
	loginUser: loginUser
};