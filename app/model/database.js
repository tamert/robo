var db_index = [];
var db_sql = [];



function connect_db(user_id, callback) {

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
        READ_WRITE: "readwrite"
    }; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var request = window.indexedDB.open("robottu_" + user_id, 3);

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var txn = event.target.transaction;

        if (!db.objectStoreNames.contains("keywords")) 
             var objStore = db.createObjectStore("keywords", { keyPath : "last_use" });
          else
             var objStore = txn.objectStore('keywords');

        if (!objStore.indexNames.contains("keyword"))
          objStore.createIndex("keyword", 'keyword', {unique:true});


        if (!db.objectStoreNames.contains("channels")) 
             var objStoreChannel = db.createObjectStore("channels", { keyPath : "created_at" });
          else
             var objStoreChannel = txn.objectStore('channels');

        if (!objStoreChannel.indexNames.contains("channels"))
          objStoreChannel.createIndex("channel_id", "channel_id", {unique:true});        


      if (!db.objectStoreNames.contains("log")) 
             var objStoreLog = db.createObjectStore("log", { keyPath : "channel_id" });
          else
             var objStoreLog = txn.objectStore('log');

      

    };


    request.onerror = function(event) {
        // Do something with request.errorCode!
        console.log('error');
        console.log(event);
    };

    request.onsuccess = function(e) {
        console.log(e);
        db_index[user_id] = e.target.result;
        //databaseler hazır uygulamaya başla
        return callback();
    }

}