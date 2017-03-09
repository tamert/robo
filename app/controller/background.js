browser.browserAction.onClicked.addListener(function() {
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
        connect_db('123', function() {
            var objStore = db_index['123'].transaction(["names3"], 'readwrite').objectStore("names3");
            var customerData = [request.addItem.keyword];

            for (var i in customerData) {
                objStore.add(customerData[i]);
            }

            keys = [];
            objStore.getAllKeys().onsuccess = function(event) {
                keys = event.target.result;
            };

            objStore.getAll().onsuccess = function(event) {
                browser.tabs.sendMessage(
                    tab_id, {
                        'type': 'get-keywords',
                        'results': event.target.result,
                        'keys' : keys
                    }
                );
            }; 


        });
        return;
    }

    if (typeof request.deleteItem !== 'undefined') {
        connect_db('123', function() {
            var objStore = db_index['123'].transaction(["names3"], 'readwrite').objectStore("names3");

            objStore.delete(request.deleteItem.key);
            
            keys = [];
            objStore.getAllKeys().onsuccess = function(event) {
                keys = event.target.result;
            };

            objStore.getAll().onsuccess = function(event) {
                browser.tabs.sendMessage(
                    tab_id, {
                        'type': 'get-keywords',
                        'results': event.target.result,
                        'keys' : keys
                    }
                );
            }; 
            
        });

        return;
    }

    if (typeof request.getkeywords !== 'undefined') {
        console.log('getkeywords kısmı');
        connect_db('123', function() {
            var objStore = db_index['123'].transaction(["names3"], 'readwrite').objectStore("names3");
            
            keys = [];
            objStore.getAllKeys().onsuccess = function(event) {
                keys = event.target.result;
            };

            objStore.getAll().onsuccess = function(event) {
                browser.tabs.sendMessage(
                    tab_id, {
                        'type': 'get-keywords',
                        'results': event.target.result,
                        'keys' : keys
                    }
                );
            }; 

          

            

        });

        browser.tabs.sendMessage(
            tab_id, {
                'type': 'debug',
                'message': request
            }
        );

        return;
    }

    browser.tabs.sendMessage(
        tab_id, {
            'type': 'debug',
            'message': request
        }
    );


});

