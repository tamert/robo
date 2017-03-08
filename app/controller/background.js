

browser.browserAction.onClicked.addListener(function (){
   browser.tabs.create({
     "url": "/index.html"
   });
});


console.log('bg ' + browser.runtime.id);

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
  var tab_id = sender.tab.id;
  var extensionId = sender.extensionId;

  if (typeof request.addItem !== 'undefined') {


    connect_db('1', function(){
        var objStore =   db_index['1'].transaction(["names3"], 'readwrite').objectStore("names3"); 

        /*
          db_index[1234].transaction(["white_list2"],"readwrite").objectStore("white_list2").put({'username': 'onur','nerden':'follows'}).onsuccess = function(e) {   };
        */
        
        var customerData = [request.addItem.keyword];

        for (var i in customerData) {
            objStore.add(customerData[i]);
        }

        objStore.getAll().onsuccess = function(event) {

          browser.tabs.sendMessage(
          tab_id,
          { 'type' : 'add-list-success', 'results' : event.target.result}              
          );

          console.log(event.target.result);
        };

    });



      return;

  }

  if (typeof request.deleteItem !== 'undefined') {

    return;
  }

  browser.tabs.sendMessage(
    tab_id,
    { 'type' :  'debug', 'message' : request}              
  );


});



