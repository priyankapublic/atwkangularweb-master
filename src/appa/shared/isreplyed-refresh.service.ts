import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsreplyedRefreshService {


  _replyedRefreshService = new Subject<any>();
  replyedRefreshService$ = this._replyedRefreshService.asObservable(); 
  sendreplyedRefreshService(val:any){  
     this._replyedRefreshService.next(val);    
   }
    constructor() { }
  }
  