import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild, CanActivate {
  role: Boolean;
  constructor(private as: AuthService, private router: Router) {
    this.role = this.as.logedIn();    
  }
  canActivate() {
    if (this.role) { return true; }
    else {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivateChild(): boolean {

    if (this.role) { return true; }
    else {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }


}