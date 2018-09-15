//create list item in workflow history
function createListItem(siteURL, itemProperties, success, failure) {

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
            SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
            SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
            })

        },
        error: function (data) {
            failure(data.responseJSON.error);
        }
    });
}