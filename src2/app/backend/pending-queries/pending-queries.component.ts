import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { AuthService } from 'src/app/shared/auth.service';
import { SendModeratorCurrentUserDetailService } from 'src/app/shared/send-moderator-current-user-detail.service';
import { Modconversations } from 'src/app/model/Modconversations';
import { map } from 'rxjs/operators';
import { Scholar } from 'src/app/model/Scholar';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';
import { ReloadService } from 'src/app/shared/reload.service';
import { OtherService } from 'src/app/shared/other.service';

@Component({
  selector: 'app-pending-queries',
  templateUrl: './pending-queries.component.html',
  styleUrls: ['./pending-queries.component.scss']
})
export class PendingQueriesComponent implements OnInit {
  con:Modconversations;
  MessageID:string;
  title: String = 'Dashboard';
  scholars:Scholar[];
  color = '';
  dataArray= { tag: '',title:'' };
  theme:boolean;
  mobileQuery: MediaQueryList;
  opened: boolean=true;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
     media: MediaMatcher,
     private router:Router,
     private as:AuthService,
     private bs:BackendService,
     private smcus: SendModeratorCurrentUserDetailService,
     private menuDataToRightPanService: MenuDataToRightPanService,
     private reloadService:ReloadService,
     private ts:ThemeService,
     private os:OtherService,
     private openCloseSidebarService:OpenCloseSidebarService
     ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);    
  }

  ngOnInit(){
      this.theme = this.ts.theme();
    if(this.theme==true){  this.color = 'primary';}else{this.color = '';}
    this.getCurrentUserDetail();
    this.changeTheme();
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  getCurrentUserDetail(){
    this.smcus.currentUser$.subscribe(
      data =>{ if(data){
        this.con = data;this.MessageID=data.MessageID;
      }else{
       delete(this.con) ;
      }     
 
        }
    )
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  closeLeftSideNav(){    
   var data = {left:this.mobileQuery.matches,right:!this.mobileQuery.matches}
   this.openCloseSidebarService.openCloseSideNav(data);
  }

  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data;if(this.theme==true){  this.color = 'primary';}else{this.color = '';} }
    );
    
  }

  logout(){ this.os.logout();}


  redirect(){
    
    localStorage.setItem('redirect_detail',JSON.stringify({MessageID:this.MessageID,ById:'1000',Reason:"Redirect",ToId:'',FromUserName:this.con.FromName}));
    localStorage.setItem('redirect_detail_fb',JSON.stringify(this.con));
    let data = this.goTo('app-scholar-redirect','Scholar Redirect');
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    delete(this.con);
  }
  reject(){
    let data ={MessageID:this.con.ID,userID:'1000',MessageStatus:'REJECT'};
    this.bs.approvReject(data).subscribe(
      data =>{ if(data=='SUCCESS'){
        this.os.swall('success','Rejected Successfully')
        this.reloadService.sendReloadService(true);
      }}
    );    
  }
  approve(){
    let data ={MessageID:this.con.ID,userID:'1000',MessageStatus:'APPROVE'}; 
    this.bs.approvReject(data).subscribe(
      data =>{  if(data=='SUCCESS'){
        this.os.swall('success','Approved Successfully')
        this.reloadService.sendReloadService(true);
      }}
    );   
  }
  sendDataToRightPan(data: any) {
    this.menuDataToRightPanService.rightPanData(data);
  }
  goTo(tag:string,title:string){
    this.dataArray.tag=tag;
    this.dataArray.title=title;
    return this.dataArray;
  }
  openRightSideNav() {
    var data = { left: !this.mobileQuery.matches, right: true }                     
    this.openCloseSidebarService.openCloseSideNav(data);   
  }
  openStoreGoogle() {
    window.open('https://play.google.com/store/apps/details?id=com.askthosewhoknow&hl=en', '_blank');
  }
  openStoreIos() {
    window.open('https://apps.apple.com/in/app/ask-those-who-know/id1209569837', '_blank');
  }
 
}
