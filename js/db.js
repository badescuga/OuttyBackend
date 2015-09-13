import * as azure from 'azure-storage';
import * as guid from './GUID';

var TableQuery = azure.TableQuery;
var TableUtilities = azure.TableUtilities;
var entityGen = TableUtilities.entityGenerator;

const USERS_TABLE_NAME = 'users';
const GROUPS_TABLE_NAME = 'groups';
const GROUPS_MEMBERS_TABLE_NAME = 'groupsMembers';
const GROUPS_MESSAGES_TABLE_NAME = 'groupsMessages';

var tableName = 'tablequerysample';
var tableService = azure.createTableService('storageapitest', 'Xq0t50sDkQmxdqlsw9o4esZCfjRhRmijSIf2cKm9fiq873Q+7HOoM1bSV4tUjaWVFBZ7xR4BXHFFAp3eKKe2og==');
var self = this;



//////external functions
async function loginUserAsync(fbId, fbName, fbPhotoPath) {
    return new Promise(function (resolve, reject) {

        //get user data
        var query = new azure.TableQuery()
            .top(1)
            .where('fbId eq ?', fbId);

        tableService.queryEntities(USERS_TABLE_NAME, query, null, function (error, result, response) {
            if (!error) {
                // query was successful
                var entities = result.entries;
                if (entities.length == 0) {
                    // no user, have to insert him
                    console.log('login: new user, inserting him in');

                    var newUserObj = {
                        PartitionKey: entityGen.String('1'),
                        RowKey: entityGen.String(guid.generate()),
                        fbId: entityGen.String(fbId),
                        fbName: entityGen.String(fbName),
                        fbPhotoPath: entityGen.String(fbPhotoPath)
                    };

                    //inserting new user in
                    tableService.insertEntity(USERS_TABLE_NAME, newUserObj, function (error, result, response) {
                        if (!error) {
                            // Entity inserted
                            console.log('user inserted, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });

                } else {
                    console.log('user exists, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                    resolve(response);
                }

            } else {
                reject(error);
            }
        });

    });
};

async function createGroupAsync(name) {

    var newGroupObj = {
        PartitionKey: entityGen.String('1'),
        RowKey: entityGen.String(guid.generate()),
        name: entityGen.String(name)
    };
    return new Promise(function (resolve, reject) {
        //inserting new group
        tableService.insertEntity(GROUPS_TABLE_NAME, newGroupObj, function (error, result, response) {
            if (!error) {
                // Entity inserted
                console.log('group inserted, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                resolve(response);
            } else {
                reject(error);
            }
        });
    });

};


async function addUserToGroupAsync(groupId, userId) {

    var newGroupUserObj = {
        PartitionKey: entityGen.String(groupId),
        RowKey: entityGen.String(userId),
    };
    return new Promise(function (resolve, reject) {
        //inserting new group
        tableService.insertEntity(GROUPS_MEMBERS_TABLE_NAME, newGroupUserObj, function (error, result, response) {
            if (!error) {
                // Entity inserted
                console.log('group user inserted, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                resolve(response);
            } else {
                reject(error);
            }
        });
    });
};

async function getGroupsAsync(userId) {

    var query = new azure.TableQuery()
        .where('RowKey eq ?', userId);

    return new Promise(function (resolve, reject) {
        //get groups for a certain user
        tableService.queryEntities(GROUPS_MEMBERS_TABLE_NAME, query, null, function (error, result, response) {
            if (!error) {
                // query succesful
                console.log('get groups query succesful, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                resolve(result);
            } else {
                reject(error);
            }
        });
    });

};

async function addGroupMessageAsync(userId, groupId, message, messageType) {
   
    var newGroupMessage = {
        PartitionKey: groupId,
        RowKey: entityGen.String(guid.generate()),
        userId: entityGen.String(userId),
        message: entityGen.String(message),
        messageType: entityGen.String(messageType)
    };

    return new Promise(function (resolve, reject) {
        //inserting new group
        tableService.insertEntity(GROUPS_MESSAGES_TABLE_NAME, newGroupMessage, function (error, result, response) {
            if (!error) {
                // Entity inserted
                console.log('group message inserted, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                resolve(response);
            } else {
                reject(error);
            }
        });
    });
};

async function getGroupMessagesAsync(groupId) {
    
    var query = new azure.TableQuery()
        .where('PartitionKey eq ?', groupId);

    return new Promise(function (resolve, reject) {
        //get groups for a certain user
        tableService.queryEntities(GROUPS_MEMBERS_TABLE_NAME, query, null, function (error, result, response) {
            if (!error) {
                // query succesful
                console.log('get group messages query succesful, awesome! result: ${ JSON.stringify(result) } \n response ${ JSON.stringify(response) }');
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};


//////// internal functions

// clones js objs with no including functions
function clone(jsObj) {
    return JSON.parse(JSON.stringify(jsObj));
}


module.exports = {
    loginUserAsync: loginUserAsync,
    createGroupAsync: createGroupAsync,
    getGroupsAsync: getGroupsAsync,
    getGroupMessagesAsync: getGroupMessagesAsync,
    addUserToGroupAsync:addUserToGroupAsync,
    addGroupMessageAsync:addGroupMessageAsync
};