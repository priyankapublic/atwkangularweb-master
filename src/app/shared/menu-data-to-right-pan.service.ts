import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuDataToRightPanService {
/*....................    CLOSE and OPEN menuDataToRightPan ............................ */

_menuDataToRightPan = new Subject<any>();
menuDataToRightPan$ = this._menuDataToRightPan.asObservable(); 
 rightPanData(val:any){

   this._menuDataToRightPan.next(val);    
 }
  constructor() { }
}
