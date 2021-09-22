

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class AuthService{
  helper = new JwtHelperService();
  ServerUrl:String=environment.url;
  errorData: {};
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  httpOptions2 = { headers: new HttpHeaders({ 'Accept': 'application/json' }) };
  httpOptionsMultiPart = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
  constructor(
    private http: HttpClient,
    private router:Router,
    private db: AngularFireDatabase,
    ) { 
   }
   getlocaton() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
  }
  showPosition(position) {
    // return this.http.get<any>(this.ServerUrl + `Userdetails/${userId}`, ).pipe(catchError(this.handleError));
    // console.log(position.coords.latitude);
    // console.log(position.coords.longitude);
  }
  address(){
    // return this.http.post<any>('https://ipinfo.io/', this.httpOptions).pipe(catchError(this.handleError));
    return this.http.get<any>('https://ipinfo.io/?token=a4b8cad33abfd3', this.httpOptions2 ).pipe(catchError(this.handleError));
  }
  // ----------------------------------------------------------------------------
  login(formdata:any) {   
    var base64 = btoa(formdata.username + ':' + formdata.password) ; 
    localStorage.setItem('interceptor','ZG9udG1lc3N1'+ base64) ;
    localStorage.setItem('username', formdata.username.toLowerCase()); 
    const headers = new HttpHeaders({ Authorization:'Basic ' + base64 });
    return this.http.post<any>(this.ServerUrl + 'authenticate/25',{headers},{observe: 'response'}).pipe(      
      catchError(this.handleError)
      );
  }

  register(formdata) {
      return this.http.post<any>(this.ServerUrl + 'Register',formdata, this.httpOptions).pipe(catchError(this.handleError));
  }
  getDetails(userId:string) {
    return this.http.get<any>(this.ServerUrl + `Userdetails/${userId}`, ).pipe(catchError(this.handleError));
  }

  logoutServer(userId:number) {
    return this.http.get<any>(this.ServerUrl + `ByeBye?userID=${userId}`, ).pipe(catchError(this.handleError));
  }
  
  recoverPassword(email:string) {    
    return this.http.get<any>(this.ServerUrl + `ForgotPassword?username=${email}`, ).pipe(catchError(this.handleError));
  }
  reActivate(email:string) {
    return this.http.post<any>(this.ServerUrl + `ReActivate?username=${email}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  registerForNotification(userId:number, registrationId:string) {
    return this.http.post<any>(this.ServerUrl + `RegisterForNotification?userID=${userId}&registrationID=${registrationId}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  setStatus(userId:number, status:string) {
    return this.http.post<any>(this.ServerUrl + `Status?userID=${userId}&Status=${status}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  changePassword(formdata:any) {
    return this.http.post<any>(this.ServerUrl + `ChangePassword`,formdata, this.httpOptions).pipe(catchError(this.handleError));
  }

  deactivate(userId:number) {
    return this.http.post<any>(this.ServerUrl + `deactivate/${userId}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  setLocalStorage(data){
    data.email=data.email.toLowerCase();
   return  localStorage.setItem('userDetail',JSON.stringify(data));
  }
  getLocalStorage(){
    if(localStorage.getItem('userDetail')){
      return JSON.parse(localStorage.getItem('userDetail'));
    }  
  }

  logout(everywhere:boolean){
    // if(everywhere){
      this.db.object('atwk_user_info/'+this.getLocalStorage().userId).update({ UserLoginStatus :'OFFLINE'})
      let userDetail =this.getLocalStorage();
      this.logoutServer(userDetail.userId).subscribe(
        data =>{},
        error=>console.log(error));
      this.setStatus(this.getLocalStorage().userId,'OFFLINE').subscribe();
        // }
    localStorage.removeItem('userDetail');
    localStorage.removeItem('username');
    localStorage.removeItem('interceptor');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('redirect_detail');
    localStorage.removeItem('menuOpened');
    // this.router.navigate(['/login']);
    location.replace('/login');
    
  }

  logedIn() {
    let data = this.getLocalStorage()
    if (data){ if(data.token) {  return true; }else{ return false; }    } 
  }
  // ----------------------------------------------------------------------------

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong.

      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message

    this.errorData = {
      errorCode: error.status,
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }
}