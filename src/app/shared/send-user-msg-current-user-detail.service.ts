import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendUserMsgCurrentUserDetailService {
  _currentUser = new Subject<any>();
  currentUser$ = this._currentUser.asObservable(); 
  sendCurrentUserDetail(val:any){
     this._currentUser.next(val);    
   }
    constructor() { }
  }
  