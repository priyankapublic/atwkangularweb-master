import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenCloseSidebarService {
/*....................    CLOSE and OPEN  SIDEBAR ............................ */

_sidebar = new Subject<any>();
sidebar$ = this._sidebar.asObservable(); 
 openCloseSideNav(val:any){

   this._sidebar.next(val);    
 }
  constructor() { }
}
