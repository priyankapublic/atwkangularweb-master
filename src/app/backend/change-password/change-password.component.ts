import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService} from '../../shared/backend.service';
import { AuthService} from '../../shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OtherService } from 'src/app/shared/other.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passError: boolean = false;
  constructor(
    private router:Router,
    
    private ts:ThemeService,
    private bs:BackendService,
    private os:OtherService,
    private as:AuthService,
    private spinner: NgxSpinnerService
    ) { }
 theme:boolean;
 color = 'accent';
 userId:string;
 ngOnInit() {
   this.theme = this.ts.theme();
   this.getUseId();
 }
 getUseId(){
   this.userId = this.as.getLocalStorage().userId;
 }
 changeThene(){
   this.ts.changeTheme(this.theme);
 }



 reacrivate(data: NgForm) {  
  this.spinner.show(); 
  let tempData = {UserId:this.userId, NewPassword: data.value.password, OldPassword:data.value.oldPassword, ConfirmPassword: data.value.cPassword, ModifierUserId: this.userId}
  let email = this.as.getLocalStorage().email;
  let pass = data.value.password;
  this.bs.changePassword(tempData).subscribe(
    data => { 
      this.spinner.hide(); 
      if(data=='SUCCESS'){
        this.os.swall('success', 'password Changed Successfully');     
        var base64 = btoa(email + ':' + pass) ; 
        localStorage.setItem('interceptor','ZG9udG1lc3N1'+ base64) ;
        setTimeout(() => {
         location.reload();   
        }, 100);
        }else{
          this.os.swall('error', data);
       }    
      },
    err => console.log(err)
  )
 }
 chkPaassword(password: string, cpassword: string) {
  if (password == cpassword) {
    this.passError = false
  } else {
    this.passError = true;
  }
}
}