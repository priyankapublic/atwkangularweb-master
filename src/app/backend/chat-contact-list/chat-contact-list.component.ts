import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../shared/auth.service';
import { SendUserMsgCurrentUserDetailService } from '../../shared/send-user-msg-current-user-detail.service';
import { OpenCloseMenubarService } from '../../shared/open-close-menubar.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { Userlist } from '../../model/Userlist';
import { NgxSpinnerService } from "ngx-spinner";
import { OpenQnaTagFilterService } from 'src/app/shared/open-qna-tag-filter.service';
import { Scholar } from 'src/app/model/Scholar';
import { OtherService } from 'src/app/shared/other.service';
import { IsreplyedRefreshService } from 'src/app/shared/isreplyed-refresh.service';
import { MsgcountReloadService } from 'src/app/shared/msgcount-reload.service';
import { StartNewChatService } from 'src/app/shared/start-new-chat.service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as sha1 from "simple-sha1";
import { of } from 'rxjs';

@Component({
  selector: 'app-chat-contact-list',
  templateUrl: './chat-contact-list.component.html',
  styleUrls: ['./chat-contact-list.component.scss']
})
export class ChatContactListComponent implements OnInit {
  slelectedTypeVar:string;
  color = 'accent';
  sortKey: string;
  ayatollah: string = '';
  subject: string = '';
  scholars: Scholar[];
  active = { left: true, right: false }
  sli: number;
  showNewChat:string  = 'chat-list';
  theme: boolean;
  mobileQuery: MediaQueryList;
  userList: Userlist[];
  latestUserList: Userlist[];
  oldestUserList: Userlist[];
  searchKey: any;
  searchKeyScholar: any;
  showMenuVar: Boolean = false;
  chatMode: Boolean = true;
  role: string;
  loginEmail: string;
  loginUserId: string;
  sha1Var: string;
  currentUserIndex: number;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private as: AuthService,
    private bs: BackendService,
    private ts: ThemeService,
    private os: OtherService,
    private sumcus: SendUserMsgCurrentUserDetailService,
    private openCloseSidebarService: OpenCloseSidebarService,
    private openCloseMenubarService: OpenCloseMenubarService,
    private openQnaTagFilterService: OpenQnaTagFilterService,
    private startNewChatService:StartNewChatService,
    private spinner: NgxSpinnerService,
    private isreplyedRefreshService:IsreplyedRefreshService,
    private db: AngularFireDatabase,
    private msgcountReloadService:MsgcountReloadService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {

    this.changeTheme();
    // this.contactList()

    this.theme = this.ts.theme();
    this.openCloseMenubar();
    this.displaystartNewChat();
    this.role = this.as.getLocalStorage().role;
    this.loginEmail = this.as.getLocalStorage().email;
    this.loginUserId = this.as.getLocalStorage().userId;
     this.isreplyedRefresh();
    this.displayqnaTagFilter() ;
    this.firebaseData();
  }

  firebaseData() {

    this.spinner.show();
    this.db.object('atwk_latest_subject/'+this.loginUserId).valueChanges().pipe(map(x => this.prepareFirbase(x))).subscribe(
      data => {

        if (data.length > 0) {
          let temp= data.sort((a, b) => new Date(a.CreatedDate).getTime() > new Date(b.CreatedDate).getTime() ? -1 : new Date(a.CreatedDate).getTime() < new Date(b.CreatedDate).getTime() ? 1 : 0);
          this.spinner.hide();
            this.contactList(temp)
            if(this.role=='ALIM'){
              this.pushDatatoFirebase();
            }
           }else{
            this.pushDatatoFirebase();
            // this.firebaseData();
        }
      },
      err => { console.log(err) ; this.spinner.hide();},
    )
  }
  prepareFirbase(x) {
    let temp = [];
    for(let key in x){
      temp.push(x[key])
    }
    return temp;
  }
  pushDatatoFirebase(){
    this.bs.contactList(this.as.getLocalStorage().email).subscribe(
      data => {
        // console.log(data)
            if(data && data.length==0){ this.spinner.hide();  }

              let tempData={};
               let i=0;
                for(let key in data) {
                  // i++;
                  // if(i<10){
                  tempData={
                  Subject : data[key].Subject,
                  ayatollah : data[key].ayatollah,
                  Text : data[key].Text,
                  To : data[key].To,
                  From : data[key].From,
                  ToUserID : data[key].ToUserID,
                  FromUserID : data[key].FromUserID,
                  ToName : data[key].ToName,
                  FromName : data[key].FromName,
                  ToImageID : data[key].ToImageID,
                  FromImageID : data[key].FromImageID,
                  MessageStatus : data[key].MessageStatus,
                  MessageID : data[key].MessageID,
                  CreatedDate : data[key].CreatedDate,
                  IsVoice : data[key].IsVoice,
                  IsRead : data[key].IsRead,
                  IsReplied : data[key].IsReplied,
                  FromUserType : data[key].FromUserType,
                  FileContextText : data[key].FileContextText,
                  ContentType : data[key].ContentType
                }
                if(data[key].FromUserType=="USER"){
                let sha1Var = sha1.sync(data[key].FromUserID + ':' + data[key].ToUserID + ':' + data[key].Subject.trim().toLocaleLowerCase() + ':' + data[key].ayatollah.trim().toLocaleLowerCase())
                  this.db.object('atwk_latest_subject/'+this.loginUserId+'/'+sha1Var).update(tempData);

                }else{
                  let sha1Var2 = sha1.sync(data[key].ToUserID + ':' +data[key].FromUserID  + ':' + data[key].Subject.trim().toLocaleLowerCase() + ':' + data[key].ayatollah.trim().toLocaleLowerCase())
                  this.db.object('atwk_latest_subject/'+this.loginUserId+'/'+sha1Var2).update(tempData);

                }
               }
              // }
       },
      error => {console.log(error) ;this.spinner.hide();}
    );
  }


  viewImg(img:string){
    this.os.swallImage(img)
  }
  isreplyedRefresh(){
    this.isreplyedRefreshService.replyedRefreshService$.subscribe(
      data =>{
          let   index = this.userList.findIndex(x => x.messageId==data);
          if(this.userList[index]){
            this.userList[index].IsReplied='Y';
            this.sendMsgcountReloadService()
          }
      }
    )
  }
  /*  create new messgae subject */
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
  prepareScholarsContact(data) {
    data = data.sort((a, b) => new Date(a.LastOnlineTime).getTime() > new Date(b.LastOnlineTime).getTime() ? -1 : new Date(a.LastOnlineTime).getTime() < new Date(b.LastOnlineTime).getTime() ? 1 : 0);
    let temp = [];
    let image = '';
    for(let key in data){

     let lastLogin;
     let res =  this.os.getDuration(data[key].LastOnlineTime);
     let UserLoginStatus=data[key].UserLoginStatus.charAt(0).toUpperCase()+data[key].UserLoginStatus.toLowerCase().slice(1);

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
  refressUser(){
  //  this.contactList();
  }
  contactList(temp) {

    // console.log(temp.filter(x=>x.Subject=="Talking about sins"));

    let obs = of(temp);
    //  this.spinner.show();
    obs.pipe(map(x => this.prepareContact(x))).subscribe(
      data => {

        this.spinner.hide(); this.userList = data;  this.scholarsContactList();
        this.sendMsgcountReloadService() ;
        // if (!this.mobileQuery.matches) {
        //   this.currentUser(this.userList[0], 0);
        // }
      },
      error => {console.log(error) ;this.spinner.hide();}
    );
  }
  sendMsgcountReloadService(){
       if(this.role=='USER'){
        let x=  this.userList.filter(x=>x.IsRead=='N');
        this.msgcountReloadService.mcReloadFun(x.length)
       }
       if(this.role=='ALIM'){
        let x=  this.userList.filter(x=>x.IsReplied=='N');
        this.msgcountReloadService.mcReloadFun(x.length)
      }
  }
  prepareContact(data) {

    let role;
    let name: string;
    if (this.as.getLocalStorage().role == 'USER') {
      role = 'ALIMS'
    } else {
      role = 'USER';
    }
    let temp = [];
    let image;
    let lastLogin
    let isReplied;
    let isRead;
    let email;
    let toEmail;
    let status ;
    for (let key in data) {
      if(data[key].To!=undefined){
      let res = this.os.getDuration(this.os.changeTimeZone(data[key].CreatedDate));
      let lastMsg = '';
      let userId ='';
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
      // if(data[key].To==undefined){
      //   console.log(data[key])
      // }

      if ( this.as.getLocalStorage().email !== data[key].To.toLowerCase()) {

        status = this.os.getDuration(this.os.changeTimeZone(data[key].CreatedDate));
        let toUser= this.bs.userProfileData(data[key].ToUserID);
        if(toUser){
          name = toUser.Name;
          image = this.bs.getuserimage(toUser.ImageID, role, 'Not Avilable')
        }else{
          name = data[key].ToName;
          image = this.bs.getuserimage(data[key].ToImageID, role, 'Not Avilable')
        }

        email = data[key].To;
        userId = data[key].ToUserID;
        isReplied = 'Z';
        isRead = 'Z';
      } else {
        status = this.os.getDuration(this.os.changeTimeZone(data[key].CreatedDate));
        let fromUser= this.bs.userProfileData(data[key].FromUserID);
        if(fromUser){
          name = fromUser.Name;
          image = this.bs.getuserimage(fromUser.ImageID, role, 'Not Avilable')
        }else{
          name = data[key].FromName;
          image = this.bs.getuserimage(data[key].FromImageID, role, 'Not Avilable')
        }
        email = data[key].From;
        userId = data[key].FromUserID;
        isReplied =data[key].IsReplied;
        isRead =data[key].IsRead;
      }

      if(res.value>0){
        lastLogin=res.value+res.unit;
      }else{
        lastLogin='now'
      }
      temp.push({userId:userId,IsRead:isRead, IsReplied: isReplied, ayatollah: data[key].ayatollah, date: data[key].CreatedDate, name: name,
         lastLogin: lastLogin, online:status.online, image: image, email: email, toEmail: data[key].To,  lastMessage: lastMsg, subject: data[key].Subject, role: role, messageId: data[key].MessageID })

    }
  }

    if (this.role == 'ALIM') {
      let temp1 = temp.filter(x=>x.IsReplied=='N');
      let temp2 = temp.filter(x=>x.IsReplied!='N');
      this.latestUserList = temp1.concat(temp2);
      this.oldestUserList  = temp1.reverse().concat(temp2.reverse());
      return this.latestUserList;
    } else {
      let temp1 = temp.filter(x=>x.IsRead=='N');
      let temp2 = temp.filter(x=>x.IsRead!='N');
      this.latestUserList = temp1.concat(temp2);
      this.oldestUserList  = temp1.reverse().concat(temp2.reverse());

      return this.latestUserList;
    }
  }


  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => { this.theme = data; }
    );
  }

  currentUser(user, i) {
    this.currentUserIndex = i;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.closeLeftSideNav()
    this.sumcus.sendCurrentUserDetail(user);
    if (this.loginEmail == user.toEmail) {
      this.updateIsRead(user.messageId);
      this.userList[i].IsRead = 'Y';
      // this.userList[i].IsReplied = 'Y';
        this.sendMsgcountReloadService()
    }

  }
  updateIsRead(msgID) {
    let data = { UserID: this.as.getLocalStorage().userId, MessageID: msgID, IsRead: 'Y' }
    this.bs.updateIsRead(data).subscribe(
      data => {},
    )
  }
  closeLeftSideNav() {
    var data = { left: !this.mobileQuery.matches, right: false }
    this.openCloseSidebarService.openCloseSideNav(data);
  }
  displayqnaTagFilter() {
    this.openQnaTagFilterService.qnaTagFilter$.subscribe(
      data => {
        if (this.showNewChat == 'filter') {
          this.showNewChat = 'chat-list';
        } else {
          this.showNewChat = 'filter';
        }
      }
    )
  }
  displaystartNewChat() {
    this.startNewChatService.startNewChat$.subscribe(
      data => {
        if (this.showNewChat == 'new-chat') {
          this.showNewChat = 'chat-list';
        } else {
          this.showNewChat = 'new-chat';
        }
      }
    )
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  openCloseMenubar() {
    this.openCloseMenubarService.menuBar$.subscribe(
      data => this.showMenuVar = data
    )
  }
  startnewChat() {
    let data = {
      Duration: "Just now",
      IsRead: "Z",
      IsReplied: "Z",
      UserLoginStatus: this.scholars[this.sli].UserLoginStatus,
      ayatollah: this.ayatollah,
      date: this.scholars[this.sli].date,
      email:this.scholars[this.sli].email,
      image: this.scholars[this.sli].image,
      lastLogin: "",
      lastMessage: "",
      messageId: "",
      name: '',
      online: this.scholars[this.sli].online,
      role: this.scholars[this.sli].role,
      subject: this.subject,
      toEmail: this.scholars[this.sli].email,
      userId: this.scholars[this.sli].userId
    }
    // this.userList.splice(0, 0, data);
    this.currentUser(data, 0);
    this.showNewChat = 'chat-list'; this.subject = ''; this.ayatollah = '';
  }
  cancelnewChat() {
    this.showNewChat = 'chat-list'; this.subject = ''; this.ayatollah = '';
  }
  sort(val: string) {
    this.slelectedTypeVar=val;
    if (val == 'oldest') {
      this.userList=this.oldestUserList;
      // this.sortKey = 'oldest';
      this.active.left = false; this.active.right = true;
    } else if (val == 'latest') {
      this.userList=this.latestUserList;
      // this.sortKey = 'latest';
      this.active.left = true; this.active.right = false;
    }
    if (!!this.searchKey) {
      let temp = this.searchKey;
      this.searchKey = ''
      setTimeout(() => {
        this.searchKey = temp;
      }, 100);
    } else {
      this.searchKey = 'Search'
      setTimeout(() => {
        this.searchKey = '';
      }, 100);
    }

  }
  claerAll(){
    this.userList=this.latestUserList;
    this.slelectedTypeVar='latest';
    this.sortKey = 'latest';
    this.active.left = true; this.active.right = false;
  }
  cancelfilter(){
    this.showNewChat = 'chat-list'
  }
  applyFilter(){
    this.showNewChat = 'chat-list'
   this.sort(this.slelectedTypeVar);
   this.sortKey =this.slelectedTypeVar;
  }
}
