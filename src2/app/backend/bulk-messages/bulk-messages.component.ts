import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService} from '../../shared/backend.service';
import { AuthService} from '../../shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Scholar } from '../../model/Scholar';
import { OtherService } from 'src/app/shared/other.service';


@Component({
  selector: 'app-bulk-messages',
  templateUrl: './bulk-messages.component.html',
  styleUrls: ['./bulk-messages.component.scss']
})
export class BulkMessagesComponent implements OnInit {
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
  logedInUser:Scholar;
 ngOnInit() {
   this.theme = this.ts.theme();
   this.getUseId();
 }
 getUseId(){
   this.logedInUser= this.as.getLocalStorage();
 }
 changeThene(){
   this.ts.changeTheme(this.theme);
 }

 bulkMessageSend(data: NgForm) {  
  this.spinner.show(); 
  this.bs.bulkMessageSend({SentByUserID:this.logedInUser.userId,SentByUserName:this.logedInUser.name,Text:data.value.comment}).subscribe(
    data => { this.spinner.hide(); 
      if(data=='SUCCESS'){
        this.os.swall('success','Message has been sent successfully')  
      }else{
        this.os.swall('error','Something went wrong. Please try after sometime')
      }    
      },
    err => console.log(err)
  )
 }
}