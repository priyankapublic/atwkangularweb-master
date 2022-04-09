import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScholarUserSwitchService {


  _scholarUserSwitch = new Subject<any>();
  scholarUserSwitch$ = this._scholarUserSwitch.asObservable(); 
   scholarUserSwitchFun(val:any){
     this._scholarUserSwitch.next(val);    
    
   }
    constructor() { }
}
