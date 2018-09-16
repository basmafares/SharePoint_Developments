
var siteURL = "http://connect.sharepoint.local/";
var wfTemplateId = "{151c50fa-cdad-49d0-ac53-3ededce142f8}";
var listName = "mylist";

$(document).ready(function () {
    $("#send").click(function () {
        $(this).prop('disabled', true);
        ExecuteOrDelayUntilScriptLoaded(getListItems, "sp.js");
    });

    $("#delete").click(function () {
        $(this).prop('disabled', true);
        ExecuteOrDelayUntilScriptLoaded(getListItems2, "sp.js");
    });



});
function getListItems() {
    $.ajax({
        url: siteURL + "/_vti_bin/ListData.svc/" + listName + "?$select=Id,Created,RequestedBy",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {

            var listiteminfo = data.d;
            var POResults = listiteminfo.results;
            var items = [];
            console.log("List Result:" + POResults.length);
            for (var j = 0; j < POResults.length; j++) {
                items.push({
                    "ID": POResults[j].Id,
                    "Requestby": POResults[j].RequestedBy,
                    "Created": POResults[j].Created
                });

            }
            var distinctArray = getDistinctArrayValues(items, "Requestby", "ID");
            for (var i = 0; i < distinctArray.length; i++) {
                var itemId = distinctArray[i].ID;
                var user = distinctArray[i].Requestby;
                addUsersToGroup(user, 2103);
            }


            $("#send").prop('disabled', false);

            setTimeout(function () {

                //Usage: create task
                var taskProperties = {
                    'Title': 'New click'

                };

                createListItem(taskProperties, function (task) {
                    console.log('item' + task.TaskName + ' has been created');
                    alert("Done");
                },
                  function (error) {
                      console.log(JSON.stringify(error));
                  }
                );

            }, 3000);






        },
        error: function (data) {
            alert('error');
            // failure(data.responseJSON.error);
        }
    });

}
//Get Distinct Result from array
//Tested
function getDistinctArrayValues(array, property, distinct_Prop) {

    var unique = {};
    var distinct = [];
    for (var i in array) {
        if (typeof (unique[array[i][property]]) == "undefined") {
            distinct.push({ "ID": array[i][distinct_Prop], "Requestby": array[i][property] });
        }
        unique[array[i][property]] = 0;
    }
    return distinct;

}

//Run workflow 
//Not Working!
function StartWorkflow(ItemURL) {
    debugger
    console.log(wfTemplateId);
    console.log(ItemURL);
    $().SPServices({
        operation: "StartWorkflow",
        item: ItemURL,
        templateId: wfTemplateId,
        workflowParameters: "<root />",
        completefunc: function () {
            console.log("Workflow initiated on single item");
        }
    });
}

//Add users to group
function addUsersToGroup(username, groupName) {
    //Get the web
    debugger;
    var clientContext = SP.ClientContext.get_current();
    var web = clientContext.get_web();

    //Get the group from the web
    var group = web.get_siteGroups().getById(groupName);

    group.get_users().addUser(web.ensureUser(username));
    //};

    group.update();

    //Load the group to the client context and execute
    clientContext.load(group);
    clientContext.executeQueryAsync(onSuccess, onFail);
}
//Add users to group
function removeUsersFromGroup(username, groupName) {
    //Get the web
    debugger;
    var clientContext = SP.ClientContext.get_current();
    var web = clientContext.get_web();

    //Get the group from the web
    var group = web.get_siteGroups().getById(groupName);

    group.get_users().remove(web.ensureUser(username));
    //};

    group.update();

    //Load the group to the client context and execute
    clientContext.load(group);
    clientContext.executeQueryAsync(onSuccess, onFail);
}
function onSuccess() {
    console.log("success");
}
function onFail(sender, args) {
    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
//create list item in workflow history
function createListItem(itemProperties, success, failure) {

    $.ajax({
        url: siteURL + "/_vti_bin/listdata.svc/WorkflowList",
        type: "POST",
        processData: false,
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(itemProperties),
        headers: {
            "Accept": "application/json;odata=verbose"
        },
        success: function (data) {
            console.log(data.d.Id);

            var id = data.d.Id;
            //StartWorkflow(siteURL + "/_vti_bin/listdata.svc/WorkflowList(" + id + ")");
            SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
                SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
                //SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", StartSiteWorkflow);
            })

        },
        error: function (data) {
            failure(data.responseJSON.error);
        }
    });
}
function getListItems2() {
    $.ajax({
        url: siteURL + "/_vti_bin/ListData.svc/" + listName + "?$select=Id,Created,RequestedBy",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {

            var listiteminfo = data.d;
            var POResults = listiteminfo.results;
            var items = [];
            console.log("List Result:" + POResults.length);
            for (var j = 0; j < POResults.length; j++) {
                items.push({
                    "ID": POResults[j].Id,
                    "Requestby": POResults[j].RequestedBy,
                    "Created": POResults[j].Created
                });

            }
            var distinctArray = getDistinctArrayValues(items, "Requestby", "ID");
            for (var i = 0; i < distinctArray.length; i++) {
                var itemId = distinctArray[i].ID;
                var user = distinctArray[i].Requestby;
                removeUsersFromGroup(user, 2103);
            }

            alert("Done");
            $("#delete").prop('disabled', false);



        },
        error: function (data) {
            alert('error');
            // failure(data.responseJSON.error);
        }
    });

}




