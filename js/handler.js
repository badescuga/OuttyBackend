//var db = require('./db.js');
import * as  db from './db'
import * as  GUID from './GUID.js'
import * as _ from 'underscore'
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

async function getGroupsIdsAsync(data) {
	try {
		return await db.getGroupsIdsAsync(data.userId);
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

async function getUsersInfoFromChatsAsync(data) { // userId

	try {
		var groupsIds = null;
		var groupsIdsFormatted = [];

		console.log(`\n\n 0 =================> `);

		//first, get all the user's groups
		groupsIds = await db.getGroupsIdsAsync(data.userId);
		groupsIds.entries.forEach((item) => {
			groupsIdsFormatted.push(item.PartitionKey._);
		});
		console.log(`\n\n 1 =================> ${JSON.stringify(groupsIdsFormatted) }`);

		//now, get all the ids for the users in these groups


		var usersIdsFormatted = {};

		for (var index = 0; index < groupsIdsFormatted.length; index++) {
			var element = groupsIdsFormatted[index];
			var usersIds = await db.getGroupUsersIdsAsync(element);
			usersIds.entries.forEach(function (element2) {
				usersIdsFormatted[element2.RowKey._] = "-";
			}, this);
		}

		console.log(`\n\n 2 ==================> ${JSON.stringify(usersIdsFormatted) }`);

		//now get all the complete info about each user
		var usersCompleteData = [];


		for (var key in usersIdsFormatted) {

			var userData = await db.getUserInfoAsync(key);
			if (userData.entries.length > 0) {
				console.log('\n\n -- ' + JSON.stringify(userData.entries[0]));
				usersCompleteData.push(userData.entries[0]);
			}
		}

		console.log(`\n\n 3 ==================> ${JSON.stringify(usersCompleteData) }`);

		return usersCompleteData;

	}
	catch (error) {
		console.log(`error in getUsersInfoFromChatAsync ${error}`);
		throw error;
	}
}

module.exports = {
	loginUserAsync: loginUserAsync,
	createGroupAsync: createGroupAsync,
	getGroupsIdsAsync: getGroupsIdsAsync,
	getGroupMessagesAsync: getGroupMessagesAsync,
	addUserToGroupAsync: addUserToGroupAsync,
	addGroupMessageAsync: addGroupMessageAsync,
	getUsersInfoFromChatsAsync: getUsersInfoFromChatsAsync
};