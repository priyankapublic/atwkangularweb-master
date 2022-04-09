import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  _ReloadService = new Subject<any>();
  ReloadService$ = this._ReloadService.asObservable(); 
  sendReloadService(val:any){  
     this._ReloadService.next(val);    
   }
    constructor() { }
  }
  