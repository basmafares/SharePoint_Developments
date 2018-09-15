/*Author: Basma Fares 
Email: basma.ahmed.mohamed@gmail.com*/
//Add users to group
function addUserToGroup(username, groupName) {
    //Get the web
    debugger;
    var clientContext = SP.ClientContext.get_current();
    var web = clientContext.get_web();

    //Get the group from the web
    var group = web.get_siteGroups().getById(groupName);
    group.get_users().addUser(web.ensureUser(username));
    group.update();

    //Load the group to the client context and execute
    clientContext.load(group);
    clientContext.executeQueryAsync(onSuccess, onFail);
}
//Add Remove user from group
function removeUserFromGroup(username, groupName) {
    //Get the web
    debugger;
    var clientContext = SP.ClientContext.get_current();
    var web = clientContext.get_web();

    //Get the group from the web
    var group = web.get_siteGroups().getById(groupName);

    group.get_users().remove(web.ensureUser(username));
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
