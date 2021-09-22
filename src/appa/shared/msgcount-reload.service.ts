import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgcountReloadService {
  _mcReload = new Subject<any>();
  mcReload$ = this._mcReload.asObservable(); 
  mcReloadFun(val:any){
     this._mcReload.next(val);    
   }
    constructor() { }
  }
  