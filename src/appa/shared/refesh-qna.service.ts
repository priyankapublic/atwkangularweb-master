import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefeshQnaService {


  _refreshQna = new Subject<any>();
  refreshQna$ = this._refreshQna.asObservable(); 
  refreshQna(val:any){  
     this._refreshQna.next(val);    
   }
    constructor() { }
  }