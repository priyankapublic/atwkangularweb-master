import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Scholar } from "../../model/Scholar";
import { UserProfileService } from 'src/app/shared/user-profile.service';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';
import { map } from 'rxjs/operators';
import { Conversations } from 'src/app/model/conversations';
import { ScholarMessageHistoryService } from 'src/app/shared/scholar-message-history.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SendSchCurrentUserDetailService } from 'src/app/shared/send-sch-current-user-detail.service';
import { OtherService } from 'src/app/shared/other.service';
@Component({
  selector: 'app-chat-history-user',
  templateUrl: './chat-history-user.component.html',
  styleUrls: ['./chat-history-user.component.scss']
})
export class ChatHistoryUserComponent implements OnInit {
  showContent:boolean=false; 
  myEmail:string;
  title: string = 'Dashboard';
  color = '';
  theme:boolean;
  mobileQuery: MediaQueryList;
  desktopQuery: MediaQueryList;
  opened: boolean=true;
  scholarDetail:Scholar;
  dataArray= { tag: '',title:''};
  conversations:Conversations[];
  conversationsDetails:Conversations[];
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
     media: MediaMatcher,
     private router:Router,
     private as:AuthService,
     private bs:BackendService,
     private os:OtherService,
     private sscus: SendSchCurrentUserDetailService,
     private ts:ThemeService,
     private userProfileService: UserProfileService,
     private menuDataToRightPanService:MenuDataToRightPanService,
     private scholarMessageHistoryService:ScholarMessageHistoryService,
     private spinner: NgxSpinnerService,
     private openCloseSidebarService:OpenCloseSidebarService
     ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.desktopQuery = media.matchMedia('(min-width:1025px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);    
    this.desktopQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(){
    this.myEmail=this.as.getLocalStorage().email;
    this.theme = this.ts.theme();
    if(this.theme==true){  this.color = 'primary';}else{this.color = '';}
    this.getCurrentUserDetail();
    this.changeTheme();
    this.dispalyconversation();
    localStorage.setItem('showProfileHistory','true')
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  getCurrentUserDetail(){
    this.sscus.currentUser$.subscribe(
      data =>{this.showContent=false;localStorage.setItem('showProfileHistory','true'); this.scholarDetail = data;this.viewHistory();this.conversationsDetails=[] ;}
    )
  }
 dispalyconversation(){
  this.scholarMessageHistoryService.messageHistory$.subscribe(
    data =>{this.getConversation(data.subject,data.from)}
  )
 }
  getConversation(Subject:string,From:string){
    this.spinner.show();
    this.bs.conversations(From,this.scholarDetail.email).pipe(map(x=>x.filter(y=>y.Subject.toLowerCase().trim()== Subject.toLowerCase().trim()))).subscribe(
      data=>{this.conversationsDetails = data; this.showContent=true;    this.spinner.hide();this.scrollToBottom();

        },
      err=>console.log(err)
    )
  }
  scrollToBottom(){
    var  bottomChat = document.getElementById("bottom-chat");
   
    setTimeout(() => {
      if(!!bottomChat){
        bottomChat.scrollIntoView({ block: "end", inline: "end"}); 
      }    
    }, 1000);    
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
  logout(){ this.os.logout()}
  viewHistory(){
    this.openRightSideNav();
    this.userProfileService.sendUserProfile({details:this.scholarDetail,history:true});
    let data = this.goTo('app-scholars-profile','History');   
    this.sendDataToRightPan(data);   
  }
  viewPrfile(){
    this.openRightSideNav();
    this.userProfileService.sendUserProfile({details:this.scholarDetail,history:false});
    let data = this.goTo('app-scholars-profile','History');   
    this.sendDataToRightPan(data);      
  }
  openRightSideNav() {
    var data = { left: !this.mobileQuery.matches, right: this.desktopQuery.matches}
    this.openCloseSidebarService.openCloseSideNav(data);   
  }
  sendDataToRightPan(data: any) {
    this.menuDataToRightPanService.rightPanData(data);
  }
  goTo(tag:string,title:string){  
    this.dataArray.tag=tag;
    this.dataArray.title=title;
    return this.dataArray;
  }
}
