// Autor: Basma Fares
/*Change column names according to your columns  (Columns used: Id,RequestedBy)
you can add more than 2 columns !!
*/

function getListItems(siteURL,listName) {
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
                    "RequestedBy": POResults[j].RequestedBy
                });

            }

            var distinctArray = getDistinctArrayValues(items, "RequestedBy", "ID");
            for (var i = 0; i < distinctArray.length; i++) {
                var itemId = distinctArray[i].ID;
                var user = distinctArray[i].RequestedBy;
                
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
   
        }
    });

}

//Get Distinct Results from array
function getDistinctArrayValues(array, property, distinct_Prop) {

    var unique = {};
    var distinct = [];
    for (var i in array) {
        if (typeof (unique[array[i][property]]) == "undefined") {
            distinct.push({ "ID": array[i][distinct_Prop], "RequestedBy": array[i][property] });
        }
        unique[array[i][property]] = 0;
    }
    return distinct;

}
