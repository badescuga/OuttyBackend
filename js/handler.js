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

async function removeUserFromGroupAsync(data) {
	try {
		console.log('test io!');
		return await db.removeUserFromGroupAsync(data.groupId, data.userId);
	} catch(error) {
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

		//console.log(`\n\n 0 =================> `);

		//first, get all the user's groups
		groupsIds = await db.getGroupsIdsAsync(data.userId);
		groupsIds.entries.forEach((item) => {
			groupsIdsFormatted.push(item.PartitionKey._);
		});

		//console.log(`\n\n 1 =================> ${JSON.stringify(groupsIdsFormatted) }`);

		//now, get all the ids for the users in these groups


		var usersIdsFormatted = {};

		await Promise.all(groupsIdsFormatted.map((element) => {
			return db.getGroupUsersIdsAsync(element).then(function (usersIds) {
				usersIds.entries.forEach(function (element2) {
					usersIdsFormatted[element2.RowKey._] = "-";
				}, this);
			});

		}));

		//console.log(`\n\n 2 ==================> ${JSON.stringify(usersIdsFormatted) }`);

		//now get all the complete info about each user
		var usersCompleteData = {};
		var usersIdsFormattedArray = [];

		//translating keys to array
		for (var key in usersIdsFormatted) {
			usersIdsFormattedArray.push(key);
		}

		await Promise.all(usersIdsFormattedArray.map((element) => {
			return db.getUserInfoAsync(element).then(function (userData) {

				if (userData.entries.length > 0) {
					var ud = userData.entries[0];
					var str = ud.RowKey._;
					//	console.log('\n\n '+ JSON.stringify(str) +'\n\n');
					usersCompleteData[str] = ud;
				}
			}, this);
		}));

		//console.log(`\n\n 3 ==================> ${JSON.stringify(usersCompleteData) }`);

		return usersCompleteData;

	}
	catch (error) {
		console.error(`error in getUsersInfoFromChatAsync ${error}`);
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
	getUsersInfoFromChatsAsync: getUsersInfoFromChatsAsync,
	removeUserFromGroupAsync:removeUserFromGroupAsync
};