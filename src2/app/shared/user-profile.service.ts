import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  _userProfile = new Subject<any>();
  userProfile$ = this._userProfile.asObservable(); 
   sendUserProfile(val:any){
     this._userProfile.next(val);    
   }
    constructor() { }
}
