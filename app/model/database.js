var db_index = [];
var db_sql = [];

function openDB(){
  try {
      if (!!window.openDatabase) {
          var shortName = 'tales';
          var version = '1.0';
          var displayName = 'Tall Tales Database';
          var maxSize = 65536; // in bytes
          db = openDatabase(shortName, version, displayName, maxSize); 
          // You should have a database instance in db.
      } else {
          console.log('not supported');
      }
  } catch(e) {
      // Error handling code goes here.
      if (e == 2) {
          // Version number mismatch.
          console.log("Invalid database version.");
      } else {
          console.log("Unknown error "+e+".");
      }
      return;
  }
}

openDB();

function connect_db(user_id, callback) {



    /*
     console.log('function çalıştı.... ');

     db_sql[user_id] = window.openDatabase('roboinsta_' + user_id, '', 'RoboInsta', null, function(db) {});


     db_sql[user_id].transaction(function(tx) {

         tx.executeSql('CREATE TABLE IF NOT EXISTS st_follow (gun INTEGER unique, sayi INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS st_unfollow (gun INTEGER unique, sayi INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS st_followers (gun INTEGER unique, sayi INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS st_likes (gun INTEGER unique, sayi INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS followers_jobs (user_id TEXT unique, screen_name TEXT, cursor TEXT, check_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS commenters_jobs (user_id TEXT unique, screen_name TEXT, check_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS searches_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, check_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS locations_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, name TEXT, check_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS location_areas_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, distance INTEGER, check_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS likes_jobs (q TEXT unique, check_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS likes (user_id TEXT unique, media_id TEXT, slug TEXT, image TEXT, insert_time INTEGER, likes_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS error_log (action TEXT, item TEXT, error_type TEXT, error_time INTEGER, next_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS sleep_times_follow (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS sleep_times_unfollow (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS sleep_times_like (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)');
         tx.executeSql('ALTER TABLE commenters_jobs ADD COLUMN comments INTEGER DEFAULT 1;');
         tx.executeSql('ALTER TABLE commenters_jobs ADD COLUMN likes INTEGER DEFAULT 1;');
        
     });

     */

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
        READ_WRITE: "readwrite"
    }; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


    console.log('function geldi mö?.... ');

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


    console.log('funtion sonu .......');


}