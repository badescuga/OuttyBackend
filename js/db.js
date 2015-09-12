import * as azure from 'azure-storage';

var TableQuery = azure.TableQuery;
var TableUtilities = azure.TableUtilities;
var eg = TableUtilities.entityGenerator;

const USERS_TABLE_NAME = 'users';
const GROUPS_TABLE_NAME = 'groups';
const GROUPS_MEMBERS__TABLE_NAME = 'groupsMembers';
const GROUPS_MESSAGES_TABLE_NAME = 'groupsMessages';

var tableName = 'tablequerysample';
var tableService = azure.createTableService('storageapitest','Xq0t50sDkQmxdqlsw9o4esZCfjRhRmijSIf2cKm9fiq873Q+7HOoM1bSV4tUjaWVFBZ7xR4BXHFFAp3eKKe2og==');


async function loginUserAsync(data) {
	return new Promise(function(resolve,reject)
		{
	// 	    var itemDescriptor = {
    //   PartitionKey: entityGen.String(self.partitionKey),
    //   RowKey: entityGen.String(uuid()),
    //   name: entityGen.String(item.name),
    //   category: entityGen.String(item.category),
    //   completed: entityGen.Boolean(false)
    // };
    // self.storageClient.insertEntity(self.tableName, itemDescriptor, function entityInserted(error) {
    //   if(error){  
    //     callback(error);
    //   }
    //   callback(null);
    // });	
		});
};

async function createGroupAsync(data) {
	
};

async function getGroupsAsync(data) {
	
};

async function getGroupMessagesAsync(data) {
	
};


module.exports = {
	loginUserAsync: loginUserAsync,
	createGroupAsync: createGroupAsync,
	getGroupsAsync: getGroupsAsync,
	getGroupMessagesAsync: getGroupMessagesAsync
};