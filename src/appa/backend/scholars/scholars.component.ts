import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component,OnInit} from '@angular/core';
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
import { AngularFireDatabase } from '@angular/fire/database';
import { Profile } from 'src/app/model/Peofile';
@Component({
  selector: 'app-scholars',
  templateUrl: './scholars.component.html',
  styleUrls: ['./scholars.component.scss']
})
export class ScholarsComponent implements OnInit {
  showContent:boolean=false;
  role:string;
  myEmail:string;
  title: string = 'Dashboard';
  color = '';
  theme:boolean;
  mobileQuery: MediaQueryList;
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
     private db: AngularFireDatabase,
     private openCloseSidebarService:OpenCloseSidebarService
     ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);    
  }

  ngOnInit(){
    this.myEmail=this.as.getLocalStorage().email;
    this.role=this.as.getLocalStorage().role;
    this.theme = this.ts.theme();
    if(this.theme==true){  this.color = 'primary';}else{this.color = '';}
    this.getCurrentUserDetail();
    this.changeTheme();
    this.dispalyconversation();
    if(this.scholarDetail){
    this.firebaseprofileData()
    }
  }
  firebaseprofileData(){
 
    this.db.object('atwk_user_info/'+this.scholarDetail.userId).valueChanges().subscribe(
      (data:Profile)=>{ 
        if(data){
          this.scholarDetail.name=data.Name;
          this.scholarDetail.image=this.bs.getuserimage(data.ImageID, data.UserType, data.Gender);
          this.scholarDetail.UserLoginStatus=data.UserLoginStatus.charAt(0).toUpperCase()+data.UserLoginStatus.toLowerCase().slice(1);
          this.scholarDetail.Duration=data.Name;
          let res = this.os.getDuration(data.LastOnlineTime);   
          if(!res.online){
                  if(this.scholarDetail.UserLoginStatus=='Online'){
                    this.scholarDetail.UserLoginStatus='Away';
            }else if(this.scholarDetail.UserLoginStatus=='Away'){
              // this.scholarDetail.UserLoginStatus='Offline';
            }
          } 
          if(res.value>0){
            this.scholarDetail.Duration=res.value+res.unit;   
          }else{
            this.scholarDetail.Duration='now' 
          }

        }
      },
      err=>{console.log(err)},
    )
  }

  viewImg(img:string){
    this.os.swallImage(img)
  }
  getCurrentUserDetail(){
    this.sscus.currentUser$.subscribe(
      data =>{this.showContent=false; this.scholarDetail = data;this.viewPrfile();this.conversationsDetails=[] ;this.firebaseprofileData();}
    )
  }
 dispalyconversation(){
  this.scholarMessageHistoryService.messageHistory$.subscribe(
    data =>{this.getConversation(data.subject,data.from)}
  )
 }
  getConversation(Subject:string,From:string){
    this.spinner.show();
    this.bs.conversations(this.myEmail,this.scholarDetail.email).pipe(map(x=>x.filter(y=>y.Subject.toLowerCase().trim()== Subject.toLowerCase().trim()))).subscribe(
      data=>{console.log(data); this.conversationsDetails = data; this.showContent=true;   this.spinner.hide();this.scrollToBottom();},
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

  // changeTheme(){
  //   this.ts.changeTheme(this.theme);
  //   if(this.theme==true){  this.color = 'primary';}else{this.color = '';}
  // }
  logout(){ this.os.logout()}
  viewHistory(){
    this.openRightSideNav();
    this.userProfileService.sendUserProfile({details:this.scholarDetail,history:true});
    let data = this.goTo('app-scholars-profile','Profile');   
    this.sendDataToRightPan(data);   
  }
  viewPrfile(){
    this.openRightSideNav();
    this.userProfileService.sendUserProfile({details:this.scholarDetail,history:false});
    let data = this.goTo('app-scholars-profile','Profile');   
    this.sendDataToRightPan(data);    
  }
  openRightSideNav() {
    var data = { left: !this.mobileQuery.matches, right: true }
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
  openStoreGoogle(){
    window.open('https://play.google.com/store/apps/details?id=com.askthosewhoknow&hl=en', '_blank');
  }
  openStoreIos(){
    window.open('https://apps.apple.com/in/app/ask-those-who-know/id1209569837', '_blank');
  }
}
