//var db = require('./db.js');
import * as  db from './db'
import * as  GUID from './GUID.js'
//import * as  testAsync from './testStorageAsync'

async function loginUserAsync(data) {
	try {
		return await db.loginUserAsync(data.fbId, data.fbName, data.fbPhotoPath);
	} catch (error) {
		throw error;
	}
};

async function createGroupAsync(data) {
	try {
		return await db.createGroupAsync(data);
	} catch (error) {
		throw error;
	}
};

async function getGroupsAsync(data) {
	try {
		return await db.getGroupsAsync(data);
	} catch (error) {
		throw error;
	}
};

async function getGroupMessagesAsync(data) {
	try {
		return await db.getGroupMessagesAsync(data);
	} catch (error) {
		throw error;
	}
};


module.exports = {
	loginUserAsync: loginUserAsync,
	createGroupAsync: createGroupAsync,
	getGroupsAsync: getGroupsAsync,
	getGroupMessagesAsync: getGroupMessagesAsync
};