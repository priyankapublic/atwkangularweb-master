import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../shared/auth.service';
import { SendUserMsgCurrentUserDetailService} from '../../shared/send-user-msg-current-user-detail.service';
import { OpenCloseMenubarService } from '../../shared/open-close-menubar.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { Userlist } from '../../model/Userlist';
import { NgxSpinnerService } from "ngx-spinner";
import { OpenQnaTagFilterService } from 'src/app/shared/open-qna-tag-filter.service';
import { Scholar } from 'src/app/model/Scholar';
import { ReloadService } from 'src/app/shared/reload.service';
import { OtherService } from 'src/app/shared/other.service';
import * as sha1 from "simple-sha1";
import { Modconversations } from 'src/app/model/Modconversations';
import { AngularFireDatabase } from '@angular/fire/database';
import { of } from 'rxjs';

@Component({
  selector: 'app-scholar-redirect',
  templateUrl: './scholar-redirect.component.html',
  styleUrls: ['./scholar-redirect.component.scss']
})
export class ScholarRedirectComponent implements OnInit {
  sha1Var: string;
  sha1VarOld: string;
  con:Modconversations;
  color = 'accent';
  ayatollah:string='';
  subject:string='';
  scholars:Scholar[];
  selectedScholar:Scholar;
  sli:number;
  showNewChat:boolean=false;
  theme:boolean;
  mobileQuery: MediaQueryList;
  userList:Userlist[];
  searchKey: any;
  searchKeyScholar: any;
  showMenuVar:Boolean = false;
  chatMode:Boolean = true;
  redirectDetail = {MessageID:0,ById:'1000',Reason:"Redirect",ToId:0,FromUserName:''}
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
    private sumcus: SendUserMsgCurrentUserDetailService,
    private openCloseSidebarService :OpenCloseSidebarService,
    private openCloseMenubarService :OpenCloseMenubarService,
    private openQnaTagFilterService: OpenQnaTagFilterService,
    private reloadService:ReloadService,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
   this.redirectDetail= JSON.parse(localStorage.getItem('redirect_detail'));
    this.changeTheme();
    this.scholarsContactList();
    this.theme=this.ts.theme();
    this.openCloseMenubar();
  this.displaystartNewChat();
}
/*  create new messgae subject */
// scholarsContactList(){
//   this.spinner.show();
//   this.bs.allUserScholar('Alims').pipe(map(x=>this.prepareScholarsContact(x))).subscribe(
//     data => {   this.spinner.hide();
//       this.scholars = data;   console.log(this.scholars[0])
//      } ,
//     error => console.log(error)
//   );
// }
scholarsContactList() {
  let obj;
  this.db.list('atwk_user_info',ref => ref.orderByChild('UserType').equalTo('ALIM')).valueChanges().subscribe(
    data=>{
        obj = of(data);
        obj.pipe(map(x => this.prepareScholarsContact(x))).subscribe(
          data => {
            this.scholars = data;

          },
          error => console.log(error)
        );
       }
  )

}
prepareScholarsContact(data){
  data = data.sort((a, b) => new Date(a.LastOnlineTime).getTime() > new Date(b.LastOnlineTime).getTime() ? -1 : new Date(a.LastOnlineTime).getTime() < new Date(b.LastOnlineTime).getTime() ? 1 : 0);
  let temp = [];
  let image = '';
  for(let key in data){
   let  UserLoginStatus=data[key].UserLoginStatus.charAt(0).toUpperCase()+data[key].UserLoginStatus.toLowerCase().slice(1);

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
    let image = this.bs.getuserimage(data[key].ImageID, data[key].UserType, data[key].Gender);
    let nationality;
    if(data[key].Nationality.length>12){
      nationality = data[key].Nationality +' ...'
    }else{
         nationality = data[key].Nationality
    }
    temp.push({
      userId: data[key].UserID,
      date: data[key].LastOnlineTime,
      name: data[key].Name,
      lastLogin: lastLogin,
      image: image,
      role: data[key].UserType,
      location: data[key].Location,
      email:data[key].UserName,
      nationality: nationality,
      details: data[key].Details,
      language: data[key].Language,
      specialisationIn: data[key].SpecialisationIn,
      studiesAt: data[key].StudiesAt,
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
/*  end create new messgae subject */


  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  currentUser(user, i){
    this.currentUserIndex = i;
    localStorage.setItem('currentUser',JSON.stringify(user));
    this.closeLeftSideNav()
    this.sumcus.sendCurrentUserDetail(user);
  }
  closeLeftSideNav(){
    var data = {left:!this.mobileQuery.matches,right:false}
    this.openCloseSidebarService.openCloseSideNav(data);
   }
   displaystartNewChat() {
    this.openQnaTagFilterService.qnaTagFilter$.subscribe(
      data =>{ this.showNewChat = data; }
    )
  }
    ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    openCloseMenubar(){
      this.openCloseMenubarService.menuBar$.subscribe(
        data => this.showMenuVar = data
      )
    }
    confirm(){
      this.selectedScholar = this.scholars.filter(x=>x.userId==this.sli)[0]
      this.redirectDetail= JSON.parse(localStorage.getItem('redirect_detail'));
      this.redirectDetail.ToId = this.sli;
      this.bs.scholarRedirect(this.redirectDetail).subscribe(
        data =>{

         if(data=='SUCCESS'){
          this.os.swall('success', 'Redirected successfully.');
           this.updatetofb();
           setTimeout(() => {
            this.reloadService.sendReloadService(true);
            this.openLeftSideNav();
           }, 1000);
        }},
        err=>console.log(err)
      );
    }
    cancelnewChat(){
      this.showNewChat=false;this.subject='';this.ayatollah='';
    }
    openLeftSideNav() {
      var data = { left:true, right:false }
      this.openCloseSidebarService.openCloseSideNav(data);
    }
       updatetofb(){
      let data = JSON.parse(localStorage.getItem('redirect_detail_fb'));
      let msgId = data.MessageID;
      this.sha1VarOld = sha1.sync(data.FromUserID + ':' + data.ToUserID + ':' + data.Subject.trim().toLocaleLowerCase() + ':' + data.ayatollah.trim().toLocaleLowerCase());

      this.sha1Var = sha1.sync(data.FromUserID + ':' + this.selectedScholar.userId + ':' + data.Subject.trim().toLocaleLowerCase() + ':' + data.ayatollah.trim().toLocaleLowerCase());
      let tempData={   Subject : data.Subject,
        ayatollah : data.ayatollah,
        Text : data.Text,
        To : this.selectedScholar.email,
        ToUserID : this.selectedScholar.userId,
        ToName : this.selectedScholar.name,
        ToImageID : this.selectedScholar.ImageID,
        From : data.From,
        FromUserID : data.FromUserID,
        FromName : data.FromName,
        FromImageID : data.FromImageID,
        MessageStatus : 'APPROVE' ,
        MessageID : data.MessageID,
        CreatedDate : data.CreatedDate,
        IsVoice : data.IsVoice,
        IsRead : data.IsRead,
        IsReplied : data.IsReplied,
        FromUserType : data.FromUserType,
        FileContextText : data.FileContextText,
        ContentType : data.ContentType

      }

       this.db.object('atwk_chat_rooms/' + this.sha1VarOld + '/'+msgId).remove();
       this.db.object('atwk_latest_subject/' + data.FromUserID + '/'+ this.sha1VarOld).remove();
       this.db.object('atwk_moderator_review/'+ '/'+msgId).remove();

       this.db.object('atwk_chat_rooms/' + this.sha1Var + '/'+msgId).update(tempData);
       this.db.object('atwk_latest_subject/' +data.FromUserID+ '/'+this.sha1Var ).update(tempData);
       this.db.object('atwk_latest_subject/' + this.selectedScholar.userId + '/'+ this.sha1Var).update(tempData);

    }
}
