import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService } from 'src/app/shared/backend.service';
import { UserProfileService } from 'src/app/shared/user-profile.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';
import { Conversations } from 'src/app/model/conversations';
import { ScholarMessageHistoryService } from 'src/app/shared/scholar-message-history.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';
import { Pendingqueries } from '../../model/Pendingqueries';
import { OtherService } from 'src/app/shared/other.service';
import { Userlist } from 'src/app/model/Userlist';

import { SendModeratorCurrentUserDetailService } from 'src/app/shared/send-moderator-current-user-detail.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-pending-queries-history',
  templateUrl: './pending-queries-history.component.html',
  styleUrls: ['./pending-queries-history.component.scss']
})
export class PendingQueriesHistoryComponent implements OnInit {
  conversations:Conversations[];
  userlist:Userlist[]
  history:boolean=false;
  profile:Pendingqueries;
  editProfile:boolean=true;
  searchKey:string;
  theme:boolean;
  mobileQuery: MediaQueryList;
  userId:string;
  email:string;
  myEmail:string;
  currentUserIndex:number;
  userdetail:{Location:'',Nationality:'',Language:'',SpecialisationIn:'',StudiesAt:'',Details:'',};
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router:Router,
    private ts:ThemeService,
    private bs:BackendService,
    private os:OtherService,
    private spinner: NgxSpinnerService,
    private userProfileService: UserProfileService,
    private scholarMessageHistoryService:ScholarMessageHistoryService,
    private as:AuthService,
    private openCloseSidebarService:OpenCloseSidebarService,
    private smcus: SendModeratorCurrentUserDetailService,

    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.profile =JSON.parse(localStorage.getItem('currentUser'));
    this.myEmail=this.as.getLocalStorage().email;
    this.changeTheme();
    this.theme=this.ts.theme();
    this.getprofile();
    this.getMsgHihtory()
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  currentUser(i:number) {
     this.currentUserIndex = i;
     this.closeLeftSideNav()
     this.smcus.sendCurrentUserDetail(this.conversations[i]);
   }
  getprofile(){
    this.userProfileService.userProfile$.subscribe(
      data=>{ this.profile=data; this.getMsgHihtory() },
      err=>console.log(err)
      );
  }
  getMsgHihtory(){
    this.spinner.show()
    this.bs.pendingQueriesByScholar(this.profile.ScholarsUserName).pipe(map(x => this.prepareContact(x))).subscribe(
      data =>{
         this.spinner.hide();
        this.userlist=data;
        },
      err=>console.log(err)
    )
  }
  prepareContact(data) {
    let temp = [];
    let temp2 = data;
    let image = '';
    let lastMsg = '';
    for (let key in data) {
      let res =  this.os.getDuration(this.os.changeTimeZone(data[key].CreatedDate));
      temp2[key].CreatedDate = this.os.changeTimeZone(data[key].CreatedDate);
      let role = 'USER';
      if (data[key].IsVoice == 'Y') {
        lastMsg = 'Audio';
      } else {
        if (data[key].ContentType) {
          if (data[key].ContentType.startsWith("image/")) {

            lastMsg = 'Image';
          } else {
            lastMsg = 'Doc';
          }
        } else {
          lastMsg = data[key].Text;
        }
      }
      let image = this.bs.getuserimage(data[key].FromImageID, role, 'Male')
      temp.push({ userId: data[key].UserID,  name: data[key].FromName,  image: image, email: data[key].From,lastMessage:lastMsg })
    }

    this.conversations=temp2;
    // console.log(this.conversations);
    return temp;
  }


  // getConversation(Subject:string,From:string){
  //   let data = {subject:Subject,from:From};
  //   this.scholarMessageHistoryService.messageHistoryFun(data);
  //   this.closeRightSideNav();
  // }
  closeRightSideNav(){
    var data = {left:!this.mobileQuery.matches,right:false}
    this.openCloseSidebarService.openCloseSideNav(data);
   }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  getChangeTheme(){
    this.ts.changeTheme(this.theme);
  }
  closeLeftSideNav() {
    var data = { left: !this.mobileQuery.matches, right: false }
    this.openCloseSidebarService.openCloseSideNav(data);
  }

}

