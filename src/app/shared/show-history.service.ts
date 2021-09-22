import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowHistoryService {

  _showHistory = new Subject<any>();
  showHistory$ = this._showHistory.asObservable(); 
   showHistoryFun(val:any){
     this._showHistory.next(val);    

   }
    constructor() { }
  }
