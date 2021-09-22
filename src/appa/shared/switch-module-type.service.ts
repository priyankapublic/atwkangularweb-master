import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwitchModuleTypeService {


  _switchMsgQnaService = new Subject<any>();
  switchModuleTypeService$ = this._switchMsgQnaService.asObservable(); 
   switchModuleTypeFun(val:any){
     this._switchMsgQnaService.next(val);    
  
   }
    constructor() { }
}
