

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

  browser.tabs.sendMessage(
  	tab_id,
  	{ 'gördüm' :  've 1 arttırıyorum :D'}              
  );

});



connect_db('1234', function(){


 var objStore =   db_index['1234'].transaction(["names3"], 'readwrite').objectStore("names3"); 

        // db_index[1234].transaction(["white_list2"],"readwrite").objectStore("white_list2").put({'username': 'onur','nerden':'follows'}).onsuccess = function(e) {   };
  var customerData = ['bill', 'donna']
        for (var i in customerData) {
            objStore.add(customerData[i]);
        }
    objStore.getAll().onsuccess = function(event) {
      console.log(event.target.result);
    };
    


  console.log('test  ++++++++ ');
});