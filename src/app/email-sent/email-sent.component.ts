import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

import { ThemeService } from '../shared/theme.service';
import { NgxSpinnerService } from "ngx-spinner";
import { OtherService } from '../shared/other.service';
@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {
  title: String = 'Reactivate Account';
  constructor(
    private router: Router,
    private as: AuthService,
    
    private ts: ThemeService,
    private os: OtherService,
    private spinner: NgxSpinnerService
  ) { }
  theme: boolean;
  color = 'accent';
  ngOnInit() {
    localStorage.setItem('interceptor','ZG9udG1lc3N1'+ 'sfdhsjfdsjfhsdjfhsjfdh') ;
    this.theme = this.ts.theme();
  }
  changeThene() {
    this.ts.changeTheme(this.theme);
  }

  reacrivate(data: NgForm) {  
    this.spinner.show();
    this.as.reActivate(data.value.email).subscribe(
      data => {  
        this.spinner.hide();
        if (data == 'SUCCESS') {
          this.os.swall('success', 'An email has been sent to to you with account reactivation access');
        } else {
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
