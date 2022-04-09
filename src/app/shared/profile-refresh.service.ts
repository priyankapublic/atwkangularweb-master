import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileRefreshService {

  _ProfileRefreshService = new Subject<any>();
  ProfileRefreshService$ = this._ProfileRefreshService.asObservable(); 
  profileRefreshService(val:any){  
     this._ProfileRefreshService.next(val);    
   }
    constructor() { }
  }