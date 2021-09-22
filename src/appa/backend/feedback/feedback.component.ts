import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService} from '../../shared/backend.service';
import { AuthService} from '../../shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OtherService } from 'src/app/shared/other.service';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  title:String='Reactivate Account';
  constructor(
    private router:Router,
    
    private ts:ThemeService,
    private bs:BackendService,
    private as:AuthService,
    private os:OtherService,
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
  this.bs.feedback({UserId:this.userId,Subject:data.value.subject,Message:data.value.comment}).subscribe(
    data => { this.spinner.hide(); 
      if(data=='SUCCESS'){
        this.os.swall('success', 'Send Successfully')
      }else{
        this.os.swall('error', 'Somthing went wrong !');
      }    
      },
    err => console.log(err)
  )
 }
}