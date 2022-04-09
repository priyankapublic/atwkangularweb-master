import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserMessageHistoryService {

  _messageHistory = new Subject<any>();
  messageHistory$ = this._messageHistory.asObservable(); 
   messageHistoryFun(val:any){
     this._messageHistory.next(val);    
  
   }
    constructor() { }
}
