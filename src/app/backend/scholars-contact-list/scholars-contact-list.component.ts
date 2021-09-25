import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { Scholar } from 'src/app/model/Scholar';
import { OtherService } from 'src/app/shared/other.service';
import { ScholarUserSwitchService } from 'src/app/shared/scholar-user-switch.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { of } from 'rxjs';

@Component({
  selector: 'app-scholars-contact-list',
  templateUrl: './scholars-contact-list.component.html',
  styleUrls: ['./scholars-contact-list.component.scss']
})
export class ScholarsContactListComponent implements OnInit {
  color = 'accent';
  theme:boolean;
  mobileQuery: MediaQueryList;
  searchKey: any;
  showMenuVar:Boolean = false;
  chatMode:Boolean = true;
  scholars:Scholar[];
  selectedUserType={name: "Scholar", userType: "Alims"}
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
    private scholarUserSwitchService:ScholarUserSwitchService,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.changeTheme();
    if(this.as.getLocalStorage().role!='MODERATOR'){
     this.contactList(this.selectedUserType.userType)
    }
    this.theme=this.ts.theme();
    this.openCloseMenubar();
    this.scholarUserSwitch()
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  refressUser(){
    this.contactList(this.selectedUserType.userType)
  }
  scholarUserSwitch(){
    if(localStorage.getItem('prfileHostoryTag')=='app-scholars'){
    this.scholarUserSwitchService.scholarUserSwitch$.subscribe(
      data => {this.selectedUserType=data; this.contactList(this.selectedUserType.userType);}
    )
    }
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  openCloseMenubar(){
    this.openCloseMenubarService.menuBar$.subscribe(
      data => this.showMenuVar = data
    )
  }
  contactList(userType:string){
    let newUserType=userType.substring(0, userType.length-1).toLocaleUpperCase()
    let ref= this.db.database.ref('atwk_user_info');
    this.db.list('atwk_user_info',ref => ref.orderByChild('UserType').equalTo(newUserType)).valueChanges().subscribe(
      data=>{this.contactListNew(data)}
    )
  }

  contactListNew(data){

    let temp = of(data)
    temp.pipe(map(x=>this.prepareContact(x))).subscribe(
      data => {
        this.scholars = data;
            if(!this.mobileQuery.matches){
          // this.currentUser(this.scholars[0]);
        }
       } ,
      error => console.log(error)
    );
  }
  prepareContact(data){
    data = data.sort((a, b) => new Date(a.LastOnlineTime).getTime() > new Date(b.LastOnlineTime).getTime() ? -1 : new Date(a.LastOnlineTime).getTime() < new Date(b.LastOnlineTime).getTime() ? 1 : 0);

    let temp = [];
    let image = '';
    for(let key in data){
     let UserLoginStatus=data[key].UserLoginStatus.charAt(0).toUpperCase()+data[key].UserLoginStatus.toLowerCase().slice(1);

     let lastLogin;
     let res =  this.os.getDuration(data[key].LastOnlineTime);
     if(!res.online){
      if(UserLoginStatus=='Online'){
        UserLoginStatus='Away';
      }else if(UserLoginStatus=='Away'){
        // UserLoginStatus='Offline';
      }
      }
      if(res.value>0){
        lastLogin=res.value+res.unit;
      }else{
        lastLogin='now'
      }
     let  image =  this.bs.getuserimage(data[key].ImageID, data[key].UserType,data[key].Gender)
     temp.push({
       userId:data[key].UserID,
       date:data[key].LastOnlineTime,
       name:data[key].Name,
       lastLogin:lastLogin ,
      //  online:res.online,
       image:image,
       email:data[key].UserName,
       role:data[key].UserType,
       location:data[key].Location,
       nationality:data[key].Nationality,
       details:data[key].Details,
       language:data[key].Language,
       specialisationIn:data[key].SpecialisationIn,
       studiesAt:data[key].StudiesAt,
       UserLoginStatus:UserLoginStatus
       })
     }
     let result;
     let online = temp.filter(x=>x.UserLoginStatus=='Online');
     online=online.sort((a, b) => new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : 0);
     let away = temp.filter(x=>x.UserLoginStatus=='Away');
     away=away.sort((a, b) => new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : 0);
     let offline = temp.filter(x=>x.UserLoginStatus=='Offline');
     offline=offline.sort((a, b) => new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : 0);

     result=  online.concat(away);
     result=  result.concat(offline);
      return result;

  }

  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  currentUser(user, i){
    this.currentUserIndex = i;
    user.showHistory= false;
    localStorage.setItem('currentUser',JSON.stringify(user));
    this.closeLeftSideNav() ;
    this.sscus.sendCurrentUserDetail(user);
  }
  closeLeftSideNav(){
    var data = {left:!this.mobileQuery.matches,right:true}
    this.openCloseSidebarService.openCloseSideNav(data);
   }

}
