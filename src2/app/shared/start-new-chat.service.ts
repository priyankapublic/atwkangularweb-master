import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartNewChatService {
  _startNewChat = new Subject<any>();
  startNewChat$ = this._startNewChat.asObservable(); 
   openstartNewChat(val:any){
     this._startNewChat.next(val);    
   }
    constructor() { }
  }
  