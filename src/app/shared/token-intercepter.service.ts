import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenIntercepterService implements HttpInterceptor {
  authToken
  constructor(private router: Router) {
    this.authToken = localStorage.getItem('interceptor').substring(12);
   }
  intercept(req, next) {
    let tokenreq = req.clone({
      setHeaders:
        { Authorization: `Basic ${this.authToken}` }
    }
    );
    return next.handle(tokenreq).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }else{  
          localStorage.removeItem('userDetail');
          localStorage.removeItem('username');
          localStorage.removeItem('interceptor');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('redirect_detail');
          localStorage.removeItem('menuOpened');
          setTimeout(() => {
          if(localStorage.getItem('reload')){
            if(localStorage.getItem('reload')=="true"){        
               location.replace('/login');             
            }
          }
        }, 1000);
        }
        }
      }));
  }
}
