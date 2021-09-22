import { Injectable } from '@angular/core';
 

@Injectable({
  providedIn: 'root'
})
export class IdbService {
 result:any;
  constructor() {
   
  }
  

  insertQNAindexedDb(data){
    const request = indexedDB.open('qna-db',1);
    // request.onerror=(event)=>{
    //  console.log('[onerror]', request.error);
    // };
    request.onsuccess = function(event) {
         var db = event.target['result'];
     var transaction = db.transaction('qna', 'readwrite');

     transaction.onsuccess = function(event) {
         console.log('[Transaction] ALL DONE!');
     };
     var qnaStore = transaction.objectStore('qna');
     data.forEach(function(qna){
      var db_op_req = qnaStore.put(qna);          
     });
    };
   request.onupgradeneeded = function(event) {
     request.result.createObjectStore('qna', {keyPath: 'q_id'});
   };

 }
 updateSingleQNAindexedDb(data){
  const request = indexedDB.open('qna-db',1);
  request.onsuccess = function(event) {
       var db = event.target['result'];
   var transaction = db.transaction('qna', 'readwrite');
  var qnaStore = transaction.objectStore('qna');
   qnaStore.put(data); 
  };

}

}