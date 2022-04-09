import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../shared/backend.service';
import { ThemeService } from '../shared/theme.service';
import { OpenCloseSidebarService } from '../shared/open-close-sidebar.service';
import { AuthService } from '../shared/auth.service';
import { OpenCloseMenubarService } from '../shared/open-close-menubar.service';
import { MenuDataToRightPanService } from '../shared/menu-data-to-right-pan.service';
import { SwitchModuleTypeService } from '../shared/switch-module-type.service';
import { OpenQnaTagFilterService } from '../shared/open-qna-tag-filter.service';
import { map, timeout } from 'rxjs/operators';
import { Qna } from '../model/Qna';
import { ScholarUserSwitchService } from '../shared/scholar-user-switch.service';
import { ReloadService } from '../shared/reload.service';
import { MsgcountReloadService } from '../shared/msgcount-reload.service';
import { StartNewChatService } from '../shared/start-new-chat.service';
import { RefeshQnaService } from '../shared/refesh-qna.service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { IdbService } from '../shared/idb.service';
import { OtherService } from '../shared/other.service';


@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnDestroy, OnInit {
  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    var date =  new Date().toJSON()
    this.db.object('atwk_user_info/'+this.as.getLocalStorage().userId).update({ UserLoginStatus :'ONLINE',LastOnlineTime : date.slice(0,-5)+'Z'});

  }
  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    var date =  new Date().toJSON()
    this.db.object('atwk_user_info/'+this.as.getLocalStorage().userId).update({ UserLoginStatus :'AWAY',LastOnlineTime :  date.slice(0,-5)+'Z'});

  }
  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeunload(event: any): void {
  //   this.db.object('atwk_user_info/'+this.as.getLocalStorage().userId).update({ UserLoginStatus :'OFFLINE'})
  // }
  msgCount:number;
  tag:string;
  qnaList: Qna[];
  disablemenuDataToRightPanService:boolean=false;
  hidemenu:boolean=false;
  color = '';
  role:string;
  tuneColor='';
  theme: boolean;
  mobileQuery: MediaQueryList;
  openedLeft: boolean = true;
  openedRight: boolean = false
  user:{};
  chatOn:boolean = true;
  rightPanTitle:string;
  selectedUserType={name: "Scholar", userType: "Alims"};

  dataArray= { tag: '',title:'' };
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private router: Router,
    private bs: BackendService,
    private as: AuthService,
    private ts: ThemeService,
    private os: OtherService,
    private openCloseSidebarService: OpenCloseSidebarService,    
    private openCloseMenubarService :OpenCloseMenubarService,
    private openQnaTagFilterService :OpenQnaTagFilterService,
    private startNewChatService:StartNewChatService,
    private menuDataToRightPanService: MenuDataToRightPanService,
    private switchModuleTypeService: SwitchModuleTypeService,
    private scholarUserSwitchService:ScholarUserSwitchService,
    private reloadService:ReloadService,
    private refeshQnaService:RefeshQnaService,
    private db: AngularFireDatabase,
    private msgcountReloadService:MsgcountReloadService,
    public auth: AngularFireAuth,
    public idbService:IdbService
 
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  }
  ngOnInit() {
    if(!localStorage.getItem('reload')){
      localStorage.clear();
       location.replace('/')
    }
    //  this.anonymousLogin();
    this.as.setStatus(this.as.getLocalStorage().userId,'ONLINE').subscribe();
    localStorage.setItem('menuOpened','true')
    this.theme = this.ts.theme();
    this.closeLeftSideNav();
    this.changeTheme();
    this.user = this.as.getLocalStorage();
    this.role =this.as.getLocalStorage().role;
    this.dataForRightPan();
    this.changeoOnOffImage();
    this.allQNA() ;
    this.scholarUserSwitch();
    this.getUserNotificationCount(this.as.getLocalStorage().email);
    this.refressNotification();
    this.getDetails();
    // this.getChangeTheme();
    this. updateDetailOnLoad();
    this.registerForNotification();
    this.bs.firebaseUserList();
  }

  async anonymousLogin() {
    await this.auth.auth.signInAnonymously();
    this.auth.auth.onAuthStateChanged(function(user) {
      if (user['P']) {console.log(user)}else{
        this.os.logout(); 
      }           
    });       
  }



  updateDetailOnLoad(){
    this.as.getDetails( this.as.getLocalStorage().userId).subscribe(
      data => {
        let time = new Date().toJSON();
        if (data) {   
          let fbData = {
            UserID : data.UserModel.UserId ,
            UserType : data.UserModel.UserType,
            UserName : data.UserModel.UserName ,
            Name : data.Name,
            Gender : data.Gender,
            Nationality : data.Nationality,
            Language : data.Language,
            Details : data.Details,
            StudiesAt : data.StudiesAt,
            SpecialisationIn : data.SpecialisationIn,
            Location : data.Location,
            ImageID : data.ImageID,
            UserTimeZone : Intl.DateTimeFormat().resolvedOptions().timeZone,
            LastOnlineTime : time.slice(0,-5)+'Z' ,
            UserLoginStatus :'ONLINE'
          }
          this.db.object('atwk_user_info/'+data.UserModel.UserId).update(fbData)
        }        
      },
      err=>console.log(err)
      )
  }
  getChangeTheme(){
    setInterval(() => {this.ts.changeTheme(true);   },5000);      
  }
  scholarUserSwitch(){
    this.scholarUserSwitchService.scholarUserSwitch$.subscribe(
      data => {this.selectedUserType=data;  this.rightPanTitle=this.selectedUserType.name;this.disablemenuDataToRightPanService=true}
    )
  }

  registerForNotification(){
    // this.as.registerForNotification(this.as.getLocalStorage().userId,localStorage.getItem('fbToken')).subscribe(
    //   data =>{}
    // )
  }
  allQNA() {
    this.bs.qnaAll(this.as.getLocalStorage().userId).pipe(map(x => this.prepareContact(x))).subscribe( 
      data => { this.qnaList = data; 
        this.idbService.insertQNAindexedDb(data);
        localStorage.setItem('qnaData','true')     
         this.bs.allQnaList=data
         this.refeshQnaService.refreshQna(true)
        },
      error => console.log(error)
    );
  }
  prepareContact(data) {   
    let temp = [];
    for (let key =0; key < data.length; key++) {
      data[key].sn = key;
      data[key].q_id =data[key].data[0].question_id;
      temp.push(data[key]);
    }
    return temp;
  }
  
  showMenu(){
    let showMenuVar:string;
    showMenuVar = localStorage.getItem('menuOpened');
    this.openCloseMenubarService.openCloseMenuBar(showMenuVar)
    if(showMenuVar == 'true'){ localStorage.setItem('menuOpened','false') }
    else{localStorage.setItem('menuOpened','true')}
    this.closeRightSideNav();
  }
    closeRightSideNav(){    
    var data = {left:true,right:false}
    this.openCloseSidebarService.openCloseSideNav(data);
   }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  closeLeftSideNav() {
    var data = { left: true, right: false }
    this.openCloseSidebarService.sidebar$.subscribe(
      data => {
        this.openedLeft = data.left;
        this.openedRight = data.right;       
      }
    )
  }
  rightsnavCloseMobile(val: boolean){
    this.openedLeft = val;
    this.openedRight = false; 
  }
  rightsnavClose(val: boolean) {
    this.openedLeft = val;
    this.openedRight = false;
  }

  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => {
      this.theme = data;   
        if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; }
      }
    );
  }
  home() {
    this.chatOn = true;  let data ;
    if(this.as.getLocalStorage().role=='MODERATOR'){  
      data = { tag: 'app-moderator-dashboard',title:'Dashboard',chatOn:true  };
    }else{
      data = { tag: 'app-user-dashboard',title:'Dashboard',chatOn:true  };
    }
   
    this.switchMsgQna(data);   
  }
  hide:boolean=false;
  publicqna() {
    this.chatOn = false;
    let data ;
    if(this.as.getLocalStorage().role=='MODERATOR'){   
      this.hide=true; 
      localStorage.setItem('prfileHostoryTag','app-chat-history-user')  
      data = { tag: 'app-chat-history-user', title:'Scholar User Chat History', chatOn:false };
    }else{
      this.hide=false; 
      data = { tag: 'app-qna',title:'Public QNA' ,chatOn:false };
    }
    this.switchMsgQna(data); 
  }
  switchMsgQna(data:any) { 
     this.switchModuleTypeService.switchModuleTypeFun(data)
  }
  changeoOnOffImage(){
    this.switchModuleTypeService.switchModuleTypeService$.subscribe(
      data => { this.tag=data.tag; 
       if(data.tag=='app-scholars' || data.tag=='app-pending-queries' ||(data.tag=='app-qna' && this.role=='MODERATOR')){
         
          this.selectedUserType.name=data.title;
          this.hidemenu=true;       
        } else{
          this.hidemenu=false;
          // if(this.as.getLocalStorage().role!='MODERATOR'){
            this.chatOn = data.chatOn;
          // }         
        }
      }
    )
  }
  
  dataForRightPan(){
    this.menuDataToRightPanService.menuDataToRightPan$.subscribe(
      data =>{  this.tag= data.tag;
        this.rightPanTitle = data.title
        // if(!this.disablemenuDataToRightPanService){this.rightPanTitle = data.title} 
      }
    )
  }
  startNewChat(){
    this.startNewChatService.openstartNewChat(true);
  }
  showFilterTagOfQna(){
    // this.tuneColor='warn';
    this.openQnaTagFilterService.openQnaTagFilter('true');
  }
  getUserNotificationCount(email){
    if(this.as.getLocalStorage().role=='MODERATOR'){
      // this.bs.getModiatorNotification().subscribe(
      //   data => {  this.msgCount=data.length ; } ,
      //   error => console.log(error)        
      // );
      this.msgcountReloadService.mcReload$.subscribe(
        data=>{this.msgCount=data}
      )
    }else{
      // this.bs.getUserNotificationCount(email).subscribe(
      //   data =>{this.msgCount=data[0].substring(11)}
      // )
      this.msgcountReloadService.mcReload$.subscribe(
        data=>{this.msgCount=data}
      )
    }

  }
  refressNotification(){
    this.reloadService.ReloadService$.subscribe(
      data => {if(data==true){this.getUserNotificationCount(this.as.getLocalStorage().email);}}
    )
    }

    updateProfile(){
      let data = this.goTo('app-update-profile','My Profile');
      this.sendDataToRightPan(data);
    }

    sendDataToRightPan(data: any) {
      this.menuDataToRightPanService.rightPanData(data);
    }
    goTo(tag:string,title:string){
      this.dataArray.tag=tag;
      this.dataArray.title=title;
      return this.dataArray;
    }

    getDetails(){
      let userData = this.as.getLocalStorage();
      let userId = userData.userId;
      this.as.getDetails(userId).subscribe(
        data =>  {  if(data){           
          userData.image =  this.bs.getuserimage(data.ImageID,data.UserModel.UserType,data.Gender);      
          this.as.setLocalStorage(userData);  
        }},
        error =>console.log(error)
      );
    }
}
