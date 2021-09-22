import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenCloseMenubarService {
/*....................    CLOSE and OPEN menuBar ............................ */

_menuBar = new Subject<any>();
menuBar$ = this._menuBar.asObservable(); 
 openCloseMenuBar(val:any){
   this._menuBar.next(val);    
 }
  constructor() { }
}
