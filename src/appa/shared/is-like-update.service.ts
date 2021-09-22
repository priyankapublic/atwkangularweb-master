import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsLikeUpdateService {

  _isLikeUpdate = new Subject<any>();
  isLikeUpdate$ = this._isLikeUpdate.asObservable(); 
  sendisLikeUpdate(val:any){  
     this._isLikeUpdate.next(val);    
   }
    constructor() { }
  }
  