import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { AuthService } from 'src/app/shared/auth.service';
import { BackendService } from 'src/app/shared/backend.service';
import { NgxSpinnerService } from "ngx-spinner";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  
  theme:boolean;
  meessageIds:string;
  mobileQuery: MediaQueryList;
  allNotification:string;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private router:Router,
    private ts:ThemeService,
    private as:AuthService,
    private bs:BackendService,  
    private spinner: NgxSpinnerService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.spinner.show();
    this.changeTheme();
    this.theme=this.ts.theme();   
    this.notification();
  }
  notification(){
    this.bs.notifiacation().pipe(map(x => this.updateNotification(x))).subscribe(
      data => { this.allNotification =data.reverse(); this.spinner.hide();},
      err => console.log(err)
    )
  }
  updateNotification(data){
    for (let key in data) {
      this.meessageIds=this.meessageIds+','+data[key].MsgID;     
    }
    this.updatenotification( this.meessageIds.substring(10))
    return data;
  }
  updatenotification(msgId){
    this.bs.readNotification(msgId,this.as.getLocalStorage().userId).subscribe(
      data =>{},
      err =>console.log(err)
    )
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  
}

