import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../shared/auth.service';
import { SendSchCurrentUserDetailService } from '../../shared/send-sch-current-user-detail.service';
import { OpenCloseMenubarService } from '../../shared/open-close-menubar.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { NgxSpinnerService } from "ngx-spinner";
import { OtherService } from 'src/app/shared/other.service';
import { Pendingqueries } from 'src/app/model/Pendingqueries';
import { Scholar } from 'src/app/model/Scholar';

@Component({
  selector: 'app-chat-history-user-contact-list',
  templateUrl: './chat-history-user-contact-list.component.html',
  styleUrls: ['./chat-history-user-contact-list.component.scss']
})
export class ChatHistoryUserContactListComponent implements OnInit {
  color = 'accent';
  loginUser;
  theme:boolean;
  mobileQuery: MediaQueryList;
  searchKey: any;
  scholarDetail=new Scholar;
  showMenuVar:Boolean = false;
  chatMode:Boolean = true;
  pendingqueries:Pendingqueries[];
  // selectedUserType={name: "Scholar", userType: "Alims"}
  private _mobileQueryListener: () => void;
  currentUserIndex: number;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router:Router,
    private as:AuthService,
    private bs:BackendService,
    private ts:ThemeService,
    private os:OtherService,
    private sscus: SendSchCurrentUserDetailService,
    private openCloseSidebarService :OpenCloseSidebarService,
    private openCloseMenubarService :OpenCloseMenubarService,
    // private scholarUserSwitchService:ScholarUserSwitchService,
    private spinner: NgxSpinnerService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.loginUser = this.as.getLocalStorage();
     this.changeTheme();
    this.contactList()
    this.theme=this.ts.theme();
    this.openCloseMenubar();
    // this.scholarUserSwitch()
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  // scholarUserSwitch(){
  //   this.scholarUserSwitchService.scholarUserSwitch$.subscribe(
  //     data => {this.selectedUserType=data; this.contactList(this.selectedUserType.userType)}
  //   )
  // }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  openCloseMenubar(){
    this.openCloseMenubarService.menuBar$.subscribe(
      data => this.showMenuVar = data
    )
  }
  contactList(){
    this.spinner.show();
    //
    this.bs.chatHistoryUsers(this.loginUser.userId).pipe(map(x=>this.prepareContact(x))).subscribe(
      data => {  this.spinner.hide();
            this.pendingqueries =data;
          if(!this.mobileQuery.matches){
          this.currentUser(this.pendingqueries[0], null)      }
       } ,
      error => console.log(error)
    );
  }
  prepareContact(data){
     for(let key in data){
      data[key].image =  this.bs.getuserimage(data[key].ScholarsImageID,'MODERATOR',data[key].Gender);
      data[key].otherimage =  this.bs.getuserimage(data[key].UsersImageID,'USER',data[key].Gender);
    }
    return data;
  }

  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  currentUser(user, i){
    this.currentUserIndex = i;
    this.scholarDetail.userId= user.ScholarsUserID;
    this.scholarDetail.name= user.ScholarsName;
    this.scholarDetail.email= user.ScholarsUserName;
    this.scholarDetail.image= user.image;
    this.scholarDetail.userEmail= user.UsersUserName;
    this.scholarDetail.showHistory= true;
    localStorage.setItem('currentUser',JSON.stringify(this.scholarDetail));
    this.closeLeftSideNav()
    this.sscus.sendCurrentUserDetail(this.scholarDetail);
  }
  closeLeftSideNav(){
    var data = {left:!this.mobileQuery.matches,right:true}
    this.openCloseSidebarService.openCloseSideNav(data);
   }

}
