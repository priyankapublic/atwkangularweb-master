import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenQnaTagFilterService {

/*....................    CLOSE and OPEN qnaTagFilter ............................ */

_qnaTagFilter = new Subject<any>();
qnaTagFilter$ = this._qnaTagFilter.asObservable(); 
 openQnaTagFilter(val:any){
   this._qnaTagFilter.next(val);    
 }
  constructor() { }
}
