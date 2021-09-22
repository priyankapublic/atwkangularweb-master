import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { ThemeService } from '../shared/theme.service';
import { NgxSpinnerService } from "ngx-spinner";
import { OtherService } from '../shared/other.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
   show:string='main';
   yourEmail:string;
   title:String='Forgot Password';
   constructor(
     private router:Router,
     private as:AuthService,     
     private ts:ThemeService,
     private os:OtherService,
     private spinner: NgxSpinnerService
     ) { }
  theme:boolean;
  color = 'accent';
  ngOnInit() {
    localStorage.setItem('interceptor','ZG9udG1lc3N1'+ 'sfdhsjfdsjfhsdjfhsjfdh') ;
    this.theme = this.ts.theme();
  }
  changeThene(){
    this.ts.changeTheme(this.theme);
  }


  forgotPass(data:NgForm) {
    this.spinner.show(); 
    this.yourEmail=data.value.email;
       this.as.recoverPassword(data.value.email).subscribe(
      data => {    this.spinner.hide(); 
        if(data=='SUCCESS'){
          this.show='popup';
          this.os.swall('success', 'An email has been sent to to you with password recovery access')
   
        }else{
          this.os.swall('error', data);

        }    
        },
      err => console.log(err)
    )
  }
  goTologin(){
    this.router.navigate(['/login'])
  }

}
