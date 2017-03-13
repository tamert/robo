function time() {
  var d = new Date();
  return  d.getTime(); 
}

window.myID = null;


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

        window.myID = request.addItem.myID;

        connect_db(window.myID, function() {
            var customerData = [request.addItem.keyword];
            //var spData = [request.addItem.sp];
            var fpData = [request.addItem.fp];

            for (var i in customerData) {
                 db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords").add({ 
                  'keyword' : customerData[i], 
                  'last_use' : time(),
                  'sp' : fpData[i],
                  'fp' : fpData[i] });
            }

     
             db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords").getAll().onsuccess = function(event) {
                browser.tabs.sendMessage(
                    tab_id, {
                        'type': 'get-keywords',
                        'results': event.target.result

                    }
                );
              };

            });
    
        return;
    }

    if (typeof request.run !== 'undefined') {
      window.myID = request.run.myID;    
    }    

    if (typeof request.channelFollow !== 'undefined') {

      window.myID = request.channelFollow.myID; 

      browser.tabs.sendMessage(
            tab_id, {
                'type': 'debug',
                'results': 'channelFollow',
                'request' : request.channelFollow
            }
        );


      connect_db(window.myID, function() {

          db_index[window.myID].transaction(["log"], 'readwrite').objectStore("log").add({ 
            'channel_id' :  request.channelFollow.channel.channel_id, 
            'success' :  request.channelFollow.success, 
            'note' :  request.channelFollow.note, 
            'video' :  request.channelFollow.channel.video,
            'title' :  request.channelFollow.channel.title, 
            'img' :  request.channelFollow.channel.img, 
            'created_at' : time(),
            'old_created_at' : request.channelFollow.channel.created_at,
            'keyword' : request.channelFollow.channel.keyword.keyword
          });
          
          db_index[window.myID].transaction(["channels"], 'readwrite').objectStore("channels").delete(request.channelFollow.channel.created_at);



      });

        return; 
    }

    if (typeof request.deleteItem !== 'undefined') {

      window.myID = request.deleteItem.myID;

        connect_db(window.myID, function() {
            var objStore = db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords");

            objStore.delete(request.deleteItem.key);
            
              browser.tabs.sendMessage(
                tab_id, {
                    'type': 'reflesh'
                }
            );
            
        });

        return;
    }

    if (typeof request.keywordChange !== 'undefined') {
        
        window.myID = request.keywordChange.myID;

        connect_db(window.myID, function() {
          

            function add_channel(keyword_list, keyword)
             // for (var i = 0, len = request.keywordChange.keywordslist.length; i < len; i++) 

              {

console.log('add c hagnnae');

                      db_index[window.myID].transaction(["log"], 'readwrite').objectStore("log")
      .openCursor(IDBKeyRange.only(keyword_list[0].key))
      .onsuccess = function(e){

      var cursor = e.target.result;
            console.log('vırt sırt');
            console.log(cursor);
               
      if (cursor==null) {

               

                   db_index[window.myID].transaction(["channels"], 'readwrite').objectStore("channels").add({ 
                    'channel_id' :  keyword_list[0].key, 
                    'video' :  keyword_list[0].video,
                    'title' :  keyword_list[0].title, 
                    'img' :  keyword_list[0].img, 
                    'created_at' : time(),
                    'keyword' : keyword
                    });

                

                

                    
            }

            keyword_list.shift()

            if (keyword_list.length>0)
            add_channel(keyword_list, keyword);

           
           }


              }

          if (request.keywordChange.keywordslist.length>0)
              add_channel(request.keywordChange.keywordslist, request.keywordChange.keyword.keyword)




          
            db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords").delete(request.keywordChange.keyword.last_use);

            db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords").add({ 
              'keyword' : request.keywordChange.keyword.keyword, 
              'last_use' : time(),
              'sp' : request.keywordChange.keyword.sp,
              'fp' : request.keywordChange.keyword.fp
             });

            db_index[window.myID].transaction(["channels"], 'readwrite').objectStore("channels").getAll().onsuccess = function(event) {
                browser.tabs.sendMessage(
                    tab_id, {
                        'type': 'reflesh_nav',
                        'results': event.target.result
                    }
                );
            }; 

        });

        return;              
    }

    if (typeof request.getkeywords !== 'undefined') {

        window.myID = request.getkeywords.myID;

        console.log('getkeywords kısmı');

        connect_db(window.myID, function() {
            var objStore = db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords");

            objStore.getAll().onsuccess = function(event) {
                browser.tabs.sendMessage(
                    tab_id, {
                        'type': 'get-keywords',
                        'results': event.target.result
                    }
                );
            }; 

        });

        return;
    }

    browser.tabs.sendMessage(
        tab_id, {
            'type': 'debug',
            'message': request
        }
    );


});


/**
 * [Havuz Getir & İşle]
*/
window.setInterval(function () {

  if(window.myID==null) 
    return;

    connect_db(window.myID, function() {

      db_index[window.myID].transaction(["keywords"], 'readwrite').objectStore("keywords")
      .openCursor(IDBKeyRange.upperBound('A'),'next')
      .onsuccess = function(e){

      var cursor = e.target.result;
            
      if (cursor) {

                if(cursor.value != null && cursor.value != undefined){
                    var newItem = cursor.value;

               
                browser.tabs.query({'url': 'https://www.youtube.com/*'},function(tabs){  
                    if (tabs.length==0)
                      return;
                  
                      browser.tabs.sendMessage(
                                    tabs[0].id, {
                                        'type': 'get-page',
                                        'results': newItem
                                    }
                                );
                 });


                }

                    
            }
           
           }

       

    });
        
}, 4000);    


/**
 * [Abone ol & Yorum Yap]
*/
window.setInterval(function () {

  if(window.myID==null) 
    return;

    connect_db(window.myID, function() {

      db_index[window.myID].transaction(["channels"], 'readwrite').objectStore("channels")
      .openCursor(IDBKeyRange.upperBound('A'), 'next')
      .onsuccess = function(e){

      var cursor = e.target.result;
            
      if (cursor) {

                if(cursor.value != null && cursor.value != undefined){
                    var newItem = cursor.value;

                browser.tabs.query({'url': 'https://www.youtube.com/*'},function(tabs){  
                    if (tabs.length==0)
                      return;
                  
                      browser.tabs.sendMessage(
                                    tabs[0].id, {
                                        'type': 'get-channel',
                                        'results': newItem
                                    }
                                );
                 });


                }

                    
            }
           
           }

       

    });
        
}, 464000);
 
