import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { ThemeService } from '../shared/theme.service';
import { BackendService } from '../shared/backend.service';
import { NgxSpinnerService } from "ngx-spinner";
import { OtherService } from '../shared/other.service';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  theme: boolean;
  color = 'accent';
  shareUrl: String = environment.shareurl;
  email: string = ""
  pass: string = ""
  // email: string = "dontmessup@hotmail.com"
  // pass: string = "faisal1234"
  constructor(
    private router: Router,
    private as: AuthService,
    private bs: BackendService,
    private db: AngularFireDatabase,
    private ts: ThemeService,
    private os: OtherService,
    private spinner: NgxSpinnerService,
    public auth: AngularFireAuth
  ) { }
  ngOnInit() {
    localStorage.setItem('reload','true')
    this.anonymousLogin();
    localStorage.setItem('interceptor','ZG9udG1lc3N1'+ 'sfdhsjfdsjfhsdjfhsjfdh') ;
    this.theme = this.ts.theme();
    setTimeout(() => {
      this.bs.firebaseUserList();
    }, 3000);

    // console.log(sha1.sync('h'))

  }
 async anonymousLogin() {
   await this.auth.auth.signInAnonymously();
      this.auth.auth.onAuthStateChanged(function(user) {
        if (user) { }else{
          this.os.logout(); 
        }           
    });      
}

  changeThene() {
    this.ts.changeTheme(this.theme);
  }
  login(data: NgForm) {
    this.spinner.show();
    this.as.login(data.value).subscribe(
      data => {
        if (data.body == 'Authorized') {
          let userId = data.headers.get('userid');
          let token = data.headers.get('token');
          this.getDetails(userId, token);
        }
      },
      err => {   
        localStorage.setItem('reload','false')    
        this.spinner.hide();
        Swal.fire({
          imageUrl: 'assets/images/common/atwk.png',
          html: '<ol><li> Kindly check your password or click forgot password </li><li> Confirm activation email is sent to your registered email  or click reactivate account </li><li> Please check app email in your inbox and click "bismillah" picture to activate your account</li>',
          imageWidth: 120,
          confirmButtonText: 'OK',     
          customClass: {
            popup: 'sky-blue-bg',
            header: 'header-class',
            title: 'title-class',
            content: 'content-class-login-error',
            image: 'image-class',
            actions: 'actions-class-del',
            confirmButton: 'confirm-button-class',
          },
        })
        // this.as.logout(false);
      }
    )
  }
  getDetails(userId: string, token: string) {
    this.as.getDetails(userId).subscribe(
      data => {
        let time = new Date().toJSON();
        if (data) {   
          let fbData = {
            UserID : data.UserModel.UserId ,
            UserType : data.UserModel.UserType,
            UserName : data.UserModel.UserName ,
            Name : data.Name,
            Gender : data.Gender,
            Nationality : data.Nationality,
            Language : data.Language,
            Details : data.Details,
            StudiesAt : data.StudiesAt,
            SpecialisationIn : data.SpecialisationIn,
            Location : data.Location,
            ImageID : data.ImageID,
            UserTimeZone : Intl.DateTimeFormat().resolvedOptions().timeZone,
            LastOnlineTime : time.slice(0,-5)+'Z' ,
            UserLoginStatus :'ONLINE'
          }
          this.db.object('atwk_user_info/'+data.UserModel.UserId).update(fbData)
           console.log(data.UserModel.UserId);
          this.spinner.hide();
          let image = this.bs.getuserimage(data.ImageID, data.UserModel.UserType, data.Gender)
          let userData = {
            token: token, userId: data.UserModel.UserId, name: data.Name, email: data.UserModel.UserName, gender: data.Gender,
            role: data.UserModel.UserType, status: data.UserModel.UserStatus, image: image, Gender: data.Gender, lastLogin: data.LastOnlineTime,
            nationality: data.Nationality, location: data.Location, language: data.Language, details: data.Details,
            contactNumber: data.ContactNumber,
            specialisationIn: data.SpecialisationIn,
            studiesAt: data.StudiesAt,
            sserLoginStatus: data.UserLoginStatus,
          }     
          this.os.swall('success', 'Signed in successfully')
          this.as.setLocalStorage(userData);
          this.as.setStatus(userData.userId, 'ONLINE');
          // this.as.registerForNotification(this.as.getLocalStorage().userId,localStorage.getItem('fbToken')).subscribe(
          //   data =>{}
          // )
          if(localStorage.getItem('shared_id')){
            // this.router.navigate(['public-qna/question/'+localStorage.getItem('shared_id')])
          }else{
            setTimeout(() => {
             window.location.replace("/");
            }, 1400);
           
          }
         
        } else {
          this.spinner.hide();
          this.os.swall('error', 'Wrong email or password');
          this.as.logout(false);
        }
      },
      error => console.log(error)
    );
  }
  getChangeTheme(){
    this.ts.changeTheme(this.theme);    
  }
}
