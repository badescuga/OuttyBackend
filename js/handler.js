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
		var userId = data.userId;
		var result = await db.createGroupAsync(data.name);
		await db.addUserToGroupAsync(result.groupId, userId);

		return result;

	} catch (error) {
		throw error;
	}
};

async function getGroupsAsync(data) {
	try {
		return await db.getGroupsAsync(data.userId);
	} catch (error) {
		throw error;
	}
};

async function getGroupMessagesAsync(data) {
	try {
		return await db.getGroupMessagesAsync(data.groupId);
	} catch (error) {
		throw error;
	}
};

async function sendGroupMessageAsync(data) {
	try {
		return await db.getGroupMessagesAsync(data.groupId);
	} catch (error) {
		throw error;
	}
};

async function addUserToGroupAsync(data) {
	try {
		return await db.addUserToGroupAsync(data.groupId, data.userId);
	}
	catch (error) {
		throw error;
	}
}

async function addGroupMessageAsync(data) {
	try {
		return await db.addGroupMessageAsync(data.userId, data.groupId, data.message, data.messageType);
	}
	catch (error) {
		throw error;
	}
}


module.exports = {
	loginUserAsync: loginUserAsync,
	createGroupAsync: createGroupAsync,
	getGroupsAsync: getGroupsAsync,
	getGroupMessagesAsync: getGroupMessagesAsync,
	addUserToGroupAsync: addUserToGroupAsync,
	addGroupMessageAsync: addGroupMessageAsync
};