var db_index = [];
var db_sql = [];



function connect_db(user_id, callback) {

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
        READ_WRITE: "readwrite"
    }; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var request = window.indexedDB.open("roboinsta_" + user_id, 26);

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var txn = event.target.transaction;

        if (!db.objectStoreNames.contains("names3")) 
             var objStore = db.createObjectStore("names3", { autoIncrement : true });
          else
             var objStore = txn.objectStore('names3');
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